"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Next.js Lite
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link
                    href="/posts"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Posts
                  </Link>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to Next.js Lite
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A modern stack with Next.js, TanStack Query, Drizzle ORM, tRPC, and Better Auth
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/posts"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              View Posts
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Get Started <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Next.js 15</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                React framework with App Router
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">TanStack Query</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Powerful data synchronization
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">tRPC</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                End-to-end type safety
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Drizzle ORM</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                TypeScript SQL ORM
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Better Auth</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Modern authentication
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Utility-first CSS framework
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
