import { User } from "@/lib/definitions";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";


const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}");

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const mapUserFromFirebaseAuthToUser = (user: any): User => {
  const userData = user.user || user;
  const { email, photoURL, displayName, uid } = userData;

  return {
    email,
    avatar: photoURL,
    displayName,
    uid,
  };
};

export const onAuthStateChanged = (onChange: any) => {
  return getAuth(app).onAuthStateChanged((user) => {
    if (user) {
      const normalizedUser = mapUserFromFirebaseAuthToUser(user);
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
  } catch (error) {
    console.log(error);
  }
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
    // console.log("Tweet añadido con éxito!");
  } catch (error) {
    // console.error("Error añadiendo el tweet: ", error);
  }
};

const mapTweetFromFirebaseToTweetObject = (doc: any) => {
  const data = doc.data();
  // Se recupera el id generado por firestore
  const id = doc.id;
  const { createdAt } = data;
  const normalizedCreatedAt = +createdAt.toDate();

  return {
    ...data,
    id,
    createdAt: normalizedCreatedAt,
  };
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

// Firebase STORAGE
export const uploadImage = (file: File) => {
  const storageRef = getStorage(app);
  const imageRef = ref(storageRef, `images/${file.name}`);
  return uploadBytesResumable(imageRef, file);
};
