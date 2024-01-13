import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpassword, setcPassword] = useState ("");

  const signUp = async () => {
    try {

      if (password == cpassword) {
      const signUpResponse = await signIn("signup", {
        email,
        password,
        name,
        redirect: false,
      });
      console.log(signUpResponse);
      if (!signUpResponse?.ok) {
        return alert(signUpResponse?.error);
      }
      window.location.href = "/dashboard";
    }else {
      return alert ("Passwords must match!")
    }
    } catch (error) {
      alert("Error signing in with email and password. Try again later.");
    }
  };

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div
        className="rounded-lg border text-card-foreground shadow-sm mx-auto max-w-sm bg-white"
        data-v0-t="card"
      >
        <div className="flex flex-col p-6 pb-2 space-y-1">
          <h3 className="tracking-tight text-2xl font-bold">Sign up</h3>
          <p className="text-sm text-muted-foreground">
            Enter your details to create an account.{" "}
            <Link href="/" className="underline">
              Already have an account?
            </Link>
          </p>
        </div>
        <div className="p-6 pt-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="name"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="cpassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={cpassword}
                onChange={(e) => setcPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="Repeat password"
              />
            </div>
            <button
              className="text-white bg-green-700 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 w-full"
              onClick={() => signUp()}
            >
              Signup
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
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {},
  };
};