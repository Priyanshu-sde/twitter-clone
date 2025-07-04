"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "~/trpc/react";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import {VscHeartFilled, VscHeart} from "react-icons/vsc";
import { IconHoverEffect } from "./iconHoverEffect";
import { LoadingSpinner } from "./LoadingSpinner";


type Tweet = {
    id: string;
    content: string;
    createdAt: Date;
    likeCount: number;
    likedByMe: boolean;
    user: { id: string; image: string | null; name: string | null };
};

type InfinityTweetListProps = {
    isLoading: boolean;
    isError: boolean;
    hasMore: boolean | undefined;
    fetchNewTweets : () => Promise<unknown>;
    tweets?: Tweet[];
}

export function InfinityTweetList({
    tweets,    
    isLoading,
    isError,
    fetchNewTweets,
    hasMore = false,
} : InfinityTweetListProps) {
    
    if (isLoading) return <LoadingSpinner/>;
    if (isError) return <div className="p-4 text-red-500">Error loading tweets</div>;
    if(tweets == null || tweets.length == 0){
        return (
            <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
        )
    }

    return (
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={<LoadingSpinner/>}
        endMessage={<div className="p-4 text-center text-gray-500">No more tweets to load</div>}
      >
        {tweets.map((tweet) => ( <TweetCard key={tweet.id}{...tweet}/>
        ))}
      </InfiniteScroll>
    );
  
}

export function RecentTweetList() {
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
        {limit: 10},
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
         }
        );
        
        return (
            <InfinityTweetList
            tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
            isError={tweets.isError}
            isLoading={tweets.isLoading}
            hasMore={tweets.hasNextPage}
            fetchNewTweets={tweets.fetchNextPage}
            />
        )
}

export function FollowingTweetList() {
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
        {onlyFollowing : true},
        {getNextPageParam : (lastpage) => lastpage.nextCursor}
    );

    return (
        <InfinityTweetList
        tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
        isError={tweets.isError}
        isLoading={tweets.isLoading}
        hasMore={tweets.hasNextPage}
        fetchNewTweets={tweets.fetchNextPage}
        />
    )
  
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
    const trpcUtils = api.useContext();

    const toggleLike = api.tweet.toggleLike.useMutation({onSuccess : ({addedLike }) => {
        const updateData: Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
            if(oldData == null) return
            const countModifier = addedLike ? 1 : -1

            return {
                ...oldData,
                pages: oldData.pages.map(page => {
                    return {
                        ...page,
                        tweets: page.tweets.map(tweet => {
                            if(tweet.id === id) {
                                return {
                                    ...tweet,
                                    likeCount : tweet.likeCount +  countModifier,
                                    likedByMe: addedLike
                                }
                            }
                            return tweet
                        })
                    }
                })
            }
        }
         trpcUtils.tweet.infiniteFeed.setInfiniteData({limit:10}, updateData);
    }})

    function handleToggleLike() {
        toggleLike.mutate({id})
    }

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
            <HeartButton isLoading={toggleLike.isPending} onClick={handleToggleLike} likedByMe={likedByMe} likeCount={likeCount}/>
        </div>
    </li>
}

type HeartButtonProps = {
    onClick: () => void
    likedByMe: boolean;
    likeCount: number;
    isLoading: boolean;
};

function HeartButton ({likeCount, isLoading, onClick, likedByMe} : HeartButtonProps) {
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

    return (
        <button 
        disabled={isLoading}
        onClick={onClick}
        className={`group flex items-center gap-1 self-start transition-colors duration-200 ${likedByMe ? "text-red-500" : "text-gray-500 hover:text-red-500 focus-visible:text-red-500" }` }>
            <IconHoverEffect red>
            <HeartIcon
            className={`transition-colors duration-200 ${
                likedByMe 
                ? "fill-red-500"
            : "group-focus-visible:fill-red-500"}`}
            />
            </IconHoverEffect>
            <span>{likeCount}</span>
        </button>
    )

}

