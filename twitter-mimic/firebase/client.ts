import { User } from "@/lib/definitions";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
);

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const mapUserFromFirebaseAuthToUser = async (
  user: any,
  likedTweets: string[],
  sharedTweets: string[]
): Promise<User> => {
  const userData = user.user || user;
  const { email, photoURL, displayName, uid } = userData;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  let userName = "";
  let avatarUrl = "";

  if (!userSnap.exists()) {
    await setDoc(
      userRef,
      {
        displayName: displayName,
        photoURL: photoURL,
      },
      { merge: true }
    );
  } else {
    userName = userSnap.data().displayName;
    avatarUrl = userSnap.data().photoURL;
  }

  return {
    email,
    avatar: avatarUrl === "" ? photoURL : avatarUrl,
    displayName: userName === "" ? displayName : userName,
    uid,
    likedTweets,
    sharedTweets,
    comments: [],
  };
};

const mapUserFromFirebaseToUser = (doc: any): User => {
  const { photoURL, displayName } = doc.data();

  return {
    uid: doc.id,
    avatar: photoURL,
    displayName,
    email: "",
    likedTweets: [],
    sharedTweets: [],
    comments: [],
  };
};

export const fetchUsersByQuery = async (nameQuery: string) => {
  const usersRef = collection(db, "users");
  const queryUsers = query(usersRef, orderBy("displayName", "asc"));

  const snapshot = await getDocs(queryUsers);

  return snapshot.docs
    .map(mapUserFromFirebaseToUser)
    .filter((user) =>
      user.displayName.toLowerCase().includes(nameQuery.toLowerCase())
    );
};

export const fetchUsersById = async (ids: string[]) => {
  const usersRef = collection(db, "users");
  const queryUsers = query(usersRef, orderBy("displayName", "asc"));

  const snapshot = await getDocs(queryUsers);

  return snapshot.docs
    .map(mapUserFromFirebaseToUser)
    .filter((user) => ids.includes(user.uid));
};

export const onAuthStateChanged = (onChange: any) => {
  return getAuth(app).onAuthStateChanged(async (user) => {
    // console.log(user)
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let likedTweets: string[] = [];
      let sharedTweets: string[] = [];

      if (userSnap.exists()) likedTweets = userSnap.data().likedTweets || [];
      if (userSnap.exists()) sharedTweets = userSnap.data().sharedTweets || [];

      const normalizedUser = await mapUserFromFirebaseAuthToUser(
        user,
        likedTweets,
        sharedTweets
      );
      onChange(normalizedUser);
    } else {
      onChange(null);
    }
  });
};

export const loginWithGitHub = async (): Promise<void> => {
  const auth = getAuth(app);
  // Crear provider con el que iniciar sesion
  const githubProvider = new GithubAuthProvider();

  try {
    /* Iniciar sesión con GitHub
  
    // const result = await signInWithPopup(auth, githubProvider);

    // const { _tokenResponse } = result as any;
    // const { screenName, photoUrl, displayName } = _tokenResponse;

    // return {
    //   username: screenName,
    //   avatar: photoUrl,
    //   displayName,
    // };

    // Se inicia sesion, se obtiene el user y se mapean los datos a retornar */

    // En el login se hace automaticamente un onAuthStateChanged (Ejecuta el useEffect)
    await signInWithPopup(auth, githubProvider);
  } catch (error) {}
};

export const loginWithGoogle = async (): Promise<void> => {
  const auth = getAuth(app);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("email");

  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {}
};

export const userSignOut = () => {
  const auth = getAuth(app);
  return auth.signOut();
};

export const addTweet = async ({
  avatar,
  content,
  userId,
  userName,
  img,
}: {
  avatar: string | null | undefined;
  content: string | null | undefined;
  userId: string | null | undefined;
  userName: string | null | undefined;
  img: string | null | undefined;
}) => {
  try {
    const tweetRef = collection(db, "tweets");
    await addDoc(tweetRef, {
      avatar,
      content,
      userId,
      userName,
      createdAt: serverTimestamp(),
      likesCount: 0,
      sharedCount: 0,
      img,
    });
  } catch (error) {
    throw new Error("Error al agregar el Tweet");
  }
};

export const retweet = async ({
  avatar,
  content,
  userId,
  userName,
  img,
  sharedId,
}: {
  avatar: string | null | undefined;
  content: string | null | undefined;
  userId: string;
  userName: string | null | undefined;
  img: string | null | undefined;
  sharedId: string | undefined;
}) => {
  const tweetRef = collection(db, "tweets");
  const userRef = doc(db, "users", userId);

  try {
    const userSnap = await getDoc(userRef);
    const originalTweetSnap = await getDoc(doc(tweetRef, sharedId));

    if (!userSnap.exists() || !originalTweetSnap.exists()) {
      throw new Error("Tweet no encontrado");
    }

    const isRetweeted = userSnap.data()?.sharedTweets?.includes(sharedId);
    const sharedCount = originalTweetSnap.data()?.sharedCount || 0;

    if (isRetweeted) {
      await updateDoc(userRef, {
        sharedTweets: isRetweeted
          ? arrayRemove(sharedId)
          : arrayUnion(sharedId),
      });

      await updateDoc(originalTweetSnap.ref, {
        sharedCount: isRetweeted ? sharedCount - 1 : sharedCount + 1,
      });

      const retweetQuery = query(
        tweetRef,
        where("userId", "==", userId),
        where("sharedId", "==", sharedId)
      );
      const retweetSnap = await getDocs(retweetQuery);
      retweetSnap.forEach((doc) => deleteDoc(doc.ref));
    } else {
      await addDoc(tweetRef, {
        avatar,
        content,
        userId,
        userName,
        createdAt: serverTimestamp(),
        likesCount: 0,
        sharedCount: 0,
        img,
        sharedId,
      });

      await updateDoc(userRef, {
        sharedTweets: arrayUnion(sharedId),
      });

      await updateDoc(originalTweetSnap.ref, {
        sharedCount: sharedCount + 1,
      });
    }
  } catch (error) {
    throw new Error("Error al hacer retweet");
  }
};

export const likeTweet = async ({
  tweetId,
  userId,
}: {
  tweetId: string;
  userId: string;
}) => {
  const userRef = doc(db, "users", userId);
  const tweetRef = doc(db, "tweets", tweetId);

  try {
    const [userSnap, tweetSnap] = await Promise.all([
      getDoc(userRef),
      getDoc(tweetRef),
    ]);

    if (!tweetSnap.exists()) throw new Error("Tweet no encontrado");

    const tweetLikesCount = tweetSnap.data().likesCount || 0;
    const isLiked =
      userSnap.exists() && userSnap.data().likedTweets?.includes(tweetId);

    await setDoc(
      userRef,
      {
        likedTweets: isLiked ? arrayRemove(tweetId) : arrayUnion(tweetId),
      },
      { merge: true }
    );

    await setDoc(
      tweetRef,
      {
        usersLiked: isLiked ? arrayRemove(userId) : arrayUnion(userId),
      },
      { merge: true }
    );

    await updateDoc(tweetRef, {
      likesCount: isLiked ? tweetLikesCount - 1 : tweetLikesCount + 1,
    });
  } catch (error) {
    throw error;
  }
};

const mapTweetFromFirebaseToTweetObject = (doc: any) => {
  const data = doc.data();
  // Se recupera el id generado por firestore
  const id = doc.id;
  const { createdAt } = data;
  const normalizedCreatedAt = createdAt ? +createdAt.toDate() : null;

  return {
    ...data,
    id,
    createdAt: normalizedCreatedAt,
  };
};

export const fetchTweetById = async (id: string) => {
  const userRef = doc(db, "tweets", id);
  const userSnap = await getDoc(userRef);
  return mapTweetFromFirebaseToTweetObject(userSnap);
};

// Para actualizar en tiempo real con firebase
// onSnapshot realiza una suscripcion en tiempo real a firebase, funciona en useEffect
export const listenLatestTweets = (callback: any) => {
  return onSnapshot(
    query(collection(db, "tweets"), orderBy("createdAt", "desc")),
    (snapshot) => callback(snapshot.docs.map(mapTweetFromFirebaseToTweetObject))
  );
};

// Para obtener los IDs de todos los tweets para ISR
export const fetchLatestTweets = async () => {
  // Se pueden filtrar los tweets segun a quien sigue el usuario
  const tweetRef = collection(db, "tweets");
  const queryTweets = query(tweetRef, orderBy("createdAt", "desc"));
  return await getDocs(queryTweets).then((snapshot) => {
    // Se mapean los docs de la db y se extraen los datos
    return snapshot.docs.map(mapTweetFromFirebaseToTweetObject);
  });
};

export const addComment = async ({
  tweetId,
  userId,
  userName,
  content,
  avatar,
}: {
  tweetId: string;
  userId: string;
  userName: string;
  content: string;
  avatar: string;
}) => {
  try {
    const commentRef = collection(db, "comments");
    const newComment = await addDoc(commentRef, {
      tweetId,
      userId,
      userName,
      content,
      avatar,
      createdAt: serverTimestamp(),
    });

    const commentId = newComment.id;
    await updateDoc(doc(db, "tweets", tweetId), {
      usersComments: arrayUnion(commentId),
    })

    await updateDoc(doc(db, "users", userId), {
      comments: arrayUnion(commentId),
    })

  } catch (error) {
    throw new Error("Error al agregar comentario");
  }
};

// export const deleteComment = async ({
//   tweetId,
//   commentId,
// }: {
//   tweetId: string;
//   commentId: string;
// }) => {

//   try {
//     const commentRef = doc(db, "comments", commentId);
//     await deleteDoc(commentRef);
//   } catch (error) {
//     throw new Error("Error al borrar comentario");
//   }
// };

export const fetchLatestTweetComments = async (tweetId: string) => {
  try {
    const commentRef = collection(db, "comments");
    const queryComments = query(
      commentRef,
      where("tweetId", "==", tweetId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(queryComments);
    return snapshot.docs.map(mapCommentFromFirebaseToCommentObject);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const mapCommentFromFirebaseToCommentObject = (doc: any) => {
  const data = doc.data();

  const id = doc.id;
  const { createdAt } = data;
  const normalizedCreatedAt = createdAt ? +createdAt.toDate() : null;

  return {
    ...data,
    id,
    createdAt: normalizedCreatedAt,
  };
};

// Firebase STORAGE
export const uploadImage = (file: File) => {
  const storageRef = getStorage(app);
  const imageRef = ref(storageRef, `images/${file.name}`);
  return uploadBytesResumable(imageRef, file);
};
