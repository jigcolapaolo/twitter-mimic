import { Button } from "@/ui/components/Button";
import TweetClient from "@/ui/components/Tweet";
import Link from "next/link";
import { firestore } from "../../../../firebase/admin";
import { Timeline } from "@/lib/definitions";
import ArrowLeft from "@/ui/icons/ArrowLeft";
import composeStyles from "@/ui/styles/composeTweet.module.css";
import { SadEmojiIcon } from "@/ui/icons/Emojis";
import ReturnButton from "@/ui/components/ReturnButton";
import Comments from "@/ui/components/Comments/Comments";

interface TweetPageProps {
  Id: string;
}

export const revalidate = 30;

export async function generateStaticParams() {
  const snapshot = await firestore.collection("tweets").get();
  return snapshot.docs.map((doc) => ({ Id: doc.id }));
}

export default async function TweetPage({
  params,
}: {
  params: TweetPageProps;
}) {
  const { Id } = params;

  try {
    const docRef = firestore.collection("tweets").doc(Id);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Tweet no encontrado");

    const data = doc.data();
    const id = doc.id;
    const createdAt = data?.createdAt;
    const normalizedCreatedAt = +createdAt.toDate();

    const props: Timeline = {
      id: id,
      content: data?.content,
      img: data?.img,
      avatar: data?.avatar,
      userName: data?.userName,
      userId: data?.userId,
      likesCount: data?.likesCount,
      sharedCount: data?.sharedCount,
      createdAt: normalizedCreatedAt,
      sharedId: data?.sharedId,
      usersLiked: data?.usersLiked,
      usersComments: data?.usersComments,
    };

    return (
      <>
        <ReturnButton className={composeStyles.svgButton}>
          <ArrowLeft width={35} height={35} className={composeStyles.svg} />
        </ReturnButton>
        <div>
          <TweetClient singleTimeline={[props]} />
        </div>
        <Comments tweetId={props.id} />
      </>
    );
  } catch (error) {
    return (
      <section className="flex flex-col items-center justify-evenly h-full ">
        <p className="flex flex-col items-center justify-center text-3xl font-bold text-center text-blue-500">
          Tweet no encontrado <SadEmojiIcon width={50} height={50} />
        </p>

        <Link href={"/home"}>
          <Button>Volver a Home</Button>
        </Link>
      </section>
    );
  }
}
