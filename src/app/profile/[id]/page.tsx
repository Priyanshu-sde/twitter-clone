// src/app/profile/[id]/page.tsx
import { directApi } from "~/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const profile = await directApi.profile.getById.query({ id });

  if (!profile || profile.name == null) {
    notFound();
  }

  return (
    <>
      <title>{`${profile.name}'s Profile | Twitter Clone`}</title>

      <div className="flex h-screen w-full flex-col items-center p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white shadow-md dark:bg-gray-800">
          <div className="h-40 w-full rounded-t-lg bg-blue-500"></div>

          <div className="relative -mt-16 px-6 pb-6">
            {profile.image && (
              <Image
                src={profile.image}
                alt={`${profile.name}'s profile picture`}
                width={128}
                height={128}
                className="rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
              />
            )}
            {!profile.image && (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-6xl text-gray-600 shadow-lg dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400">
                ?
              </div>
            )}

            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <div className="mt-2 flex space-x-4 text-gray-700 dark:text-gray-300">
                <span>
                  <span className="font-semibold">
                    {profile.tweetsCount}
                  </span>{" "}
                  Tweets
                </span>
                <span>
                  <span className="font-semibold">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </span>
                <span>
                  <span className="font-semibold">
                    {profile.followsCount}
                  </span>{" "}
                  Following
                </span>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                A passionate Twitter Clone user.
              </p>
            </div>

            <div className="mt-6">
              <button
                className={`rounded-full px-6 py-2 ${
                  profile.isFollowing
                    ? "border border-blue-500 text-blue-500 hover:bg-blue-50"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Tweets
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                No tweets to display yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}