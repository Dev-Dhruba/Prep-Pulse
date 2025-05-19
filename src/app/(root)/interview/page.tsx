"use client";
import Agent from "@/components/Agent";
import { useAuth } from "@/utils/contexts/UserProvider";
import { useEffect, useState } from "react";

export default function InterviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Set a small timeout to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  console.log("user data", user);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Loading your interview...
          </p>
        </div>
      ) : (
        <Agent
          userName={user?.full_name || ""}
          userId={user?.id}
          type="generate"
        />
      )}
    </>
  );
}
