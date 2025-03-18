"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AuthButton from "../components/AuthButton";

export default function SignIn() {
  const { data: session } = useSession();
  
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center">
            <AuthButton />
          </div>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              You need to sign in with Google to use this application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}