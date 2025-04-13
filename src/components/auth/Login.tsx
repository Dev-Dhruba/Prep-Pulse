"use client";
import React from "react";
import { signin } from "@/utils/functions/signin";
import { signup } from "@/utils/functions/signup";
import { OauthSignin } from "@/utils/functions/signin-oauth";

export default function LoginPage() {

  const handleGoogleSignup = async () => {
    console.log("Google signup clicked");
    const { error } = await OauthSignin("google");
  
    if (error) {
      console.error("Google signup failed:", error.message);
    }
  };
  

  const handleGithubSignup = async () => {
    console.log("Google signup clicked");
    const { error } = await OauthSignin("github");
  
    if (error) {
      console.error("Google signup failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-900 p-6">
      <div className="relative w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Welcome Back
        </h2>
        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            <button
              formAction={signin}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Log in
            </button>
            <button
              formAction={async (formData) => {
                await signup(formData);
              }}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 font-medium text-blue-400 hover:bg-gray-600"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center rounded-lg border border-gray-600 bg-white px-6 py-3 font-medium text-black hover:bg-gray-200"
          >
            {/* <img src="/google-icon.svg" alt="Google" className="mr-3 h-5 w-5" /> */}
            Sign up with Google
          </button>
          <button
            onClick={handleGithubSignup}
            className="w-full flex items-center justify-center rounded-lg border border-gray-600 bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
          >
            {/* <img src="/github-icon.svg" alt="GitHub" className="mr-3 h-5 w-5" /> */}
            Sign up with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
