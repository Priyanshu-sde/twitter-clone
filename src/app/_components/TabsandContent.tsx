"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewTweetForm } from "./NewTweetForm";
import { FollowingTweetList, InfinityTweetList, RecentTweetList } from "./InfinityTweetList";

const TABS = ["Recent", "Following"] as const;
type Tab = (typeof TABS)[number];

export function TabsandContent() {
  const session = useSession();
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        <div className="flex">
          {session.status === "authenticated" &&
            TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${tab === selectedTab ? "border-b-4 border-b-blue-500 font-bold" : ""}`}
                >
                  {tab}
                </button>
              );
            })}
        </div>
      </header>
      <NewTweetForm />
      {selectedTab === "Recent" ? <RecentTweetList /> : <FollowingTweetList/>}
      
    </>
  );
}
