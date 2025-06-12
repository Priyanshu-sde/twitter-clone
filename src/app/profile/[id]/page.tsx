// src/app/profile/[id]/page.tsx
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;

  const profile = await api.profile.getById.query({ id });

  if (profile == null || profile.name == null) {
    notFound();
  }

  return (
    <>
      <title>Twitter Clone {profile.name}</title>

      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-3xl font-bold">Profile of {profile.name}</h1>
        <p className="text-lg">User ID: {profile.id}</p>
        {profile.email && <p>Email: {profile.email}</p>}
      </div>
    </>
  );
}