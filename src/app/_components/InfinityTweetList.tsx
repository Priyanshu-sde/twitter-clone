"use client";
import type { NumberLiteralType } from "typescript";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "~/trpc/react";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import {VscHeartFilled, VscHeart} from "react-icons/vsc";


type Tweet = {
    id: string;
    content: string;
    createdAt: Date;
    likeCount: number;
    likedByMe: boolean;
    user: { id: string; image: string | null; name: string | null };
};

export function InfinityTweetList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = api.tweet.infiniteFeed.useInfiniteQuery(
        {limit: 10},
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         }
    );
    if (isLoading) return <div className="p-4">Loading tweets...</div>;
    if (isError) return <div className="p-4 text-red-500">Error loading tweets</div>;
    const tweets = data?.pages.flatMap(page => page.tweets) ?? [];

    return (
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNextPage}
        hasMore={hasNextPage ?? false}
        loader={<div className="p-4">Loading more tweets...</div>}
        endMessage={<div className="p-4 text-center text-gray-500">No more tweets to load</div>}
      >
        {tweets.map((tweet) => ( <TweetCard key={tweet.id}{...tweet}/>
        ))}
      </InfiniteScroll>
    );
  
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
})

function TweetCard({
    id,
    user,
    content,
    createdAt,
    likeCount,
    likedByMe,
} : Tweet) {
    return <li className="flex gap-4 border-b px-4 py-4">
        <Link href={`/profile/${user.id}`}>
            <ProfileImage src={user.image}/>
        </Link>
        <div className="flex flex-grow flex-col">
            <div className="flex gap-1">
                <Link
                href={`/profile/${user.id}`}
                className="font-bold outline-none hover:underline focus-visible:underline"
                >
                    {user.name}
                </Link>
                <span className="text-gray-500">-</span>
                <span className="text-gray-500">{dateTimeFormatter.format(createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap">{content}</p>
            <HeartButton likedByMe={likedByMe} likeCount={likeCount}/>
        </div>
    </li>
}

type HeartButtonProps = {
    likedByMe: boolean;
    likeCount: number
};

function HeartButton ({likeCount, likedByMe} : HeartButtonProps) {
    const session = useSession();
    const HeartIcon = likedByMe ?  VscHeartFilled : VscHeart;

    if (session.status !== "authenticated"){
        return (
            <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
                <HeartIcon/>
                <span>{likeCount}</span>
            </div>
        )
    }

}