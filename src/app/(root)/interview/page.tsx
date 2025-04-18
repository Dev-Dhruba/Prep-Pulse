"use client";
import Agent from "@/components/Agent";
import Expression from "@/components/expression-analysis";
import { useAuth } from "@/utils/contexts/UserProvider";

export default function InterviewPage() {

  const { user } = useAuth();
  console.log(user?.user_metadata?.full_name);
  console.log(user?.id)
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Mock Interview</h1>
      <Agent userName={user?.user_metadata?.full_name} userId={user?.id} type="generate" />
      <Expression/>

    </>
  );
}
