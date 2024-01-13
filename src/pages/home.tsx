import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Dashboard() {
  const { data } = useSession();

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div
        className="rounded-lg border text-card-foreground shadow-sm mx-auto max-w-sm bg-white"
        data-v0-t="card"
      >
        <div className="flex flex-col p-6 space-y-1 gap-3">
          <h3 className="tracking-tight text-2xl font-bold">
            Welcome, {data?.user?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Your email address is {data?.user?.email}.
          </p>
          <button
            className="text-white bg-red-700 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 w-full"
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};