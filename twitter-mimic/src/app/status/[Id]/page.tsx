import { Button } from "@/ui/components/Button";
import Tweet from "@/ui/components/Tweet";
import Link from "next/link";
import { fetchLatestTweets } from "../../../../firebase/client";
import { firestore } from "../../../../firebase/admin";
import { Timeline } from "@/lib/definitions";

interface TweetPageProps {
  Id: string;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const tweetIds = await fetchLatestTweets();
  return tweetIds.map((tweet: Timeline) => ({ Id: tweet.id }));
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

    const props = {
      Id: id,
      content: data?.content,
      img: data?.img,
      avatar: data?.avatar,
      userName: data?.userName,
      userId: data?.userId,
      likesCount: data?.likesCount,
      sharedCount: data?.sharedCount,
      createdAt: normalizedCreatedAt,
    }

    return (
      <div>
        <Tweet
          id={props.Id}
          content={props.content}
          img={props.img}
          avatar={props.avatar}
          userName={props.userName}
          userId={props.userId}
          createdAt={props.createdAt}
          likesCount={props.likesCount}
          sharedCount={props.sharedCount}
        />
      </div>
    );
  } catch (error) {
    return (
      <section className="flex flex-col items-center h-full justify-evenly">
        <p className="text-3xl font-bold text-center text-blue-500">
          Tweet no encontrado
        </p>
        <Button>
          <Link href="/home">Volver a Home</Link>
        </Button>
      </section>
    );
  }
}
