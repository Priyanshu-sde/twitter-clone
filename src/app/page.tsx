import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { NewTweetForm } from "./_components/NewTweetForm";
import { InfinityTweetList } from "./_components/InfinityTweetList";

export default async function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
      <InfinityTweetList/>
    </>
  );
};

