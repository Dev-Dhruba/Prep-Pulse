"use client";
import Agent from "@/components/Agent";
import { useAuth } from "@/utils/contexts/UserProvider";

export default function InterviewPage() {

  const {  user } = useAuth();
  console.log("usee data",user);
  
  return (
    <>
      <Agent userName={user?.full_name || ""} userId={user?.id} type="generate" />
    </>
  );
}
