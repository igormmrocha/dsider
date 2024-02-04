import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import Logo from '../logo/logo.png';

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmailAndPassword = async () => {
   
      window.location.href = "/home_anonymous";
    
  };

  return (
    <div className="bg-green-300 min-h-screen flex items-center justify-center">
      <div className="flex max-w-md flex-col gap-4">
        <div className="flex justify-center">
          <div className="flex flex-col p-6 pb-2 space-y-1">
            <img src={Logo.src} style={{ width: 100, height: 100 }} alt="logo" />
            <div className="tracking-tight text-2xl font-bold text-black">DSIDER</div>
          </div>
        </div>
        <div className="flex flex-col p-6 pb-2 space-y-1">
          <h3 className="tracking-tight text-lg font-bold">Login</h3>
          <p className="text-sm text-muted-foreground">
            Choose between login with Google or enter without login.
          </p>
        </div>
        <div className="p-6 pt-2">
          <div className="space-y-3">
            <button
              className="text-black bg-purple-500 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 w-full"
              onClick={signInWithEmailAndPassword}
            >
              Enter without login
            </button>
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full bg-purple-500 text-black"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  console.log(session);
  if (session) {
    return {
      redirect: {
        destination: "/home",
      },
    };
  }

  return {
    props: {},
  };
};