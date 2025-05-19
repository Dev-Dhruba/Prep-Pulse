"use client";
import React from 'react'
import Agent from '@/components/Agent';
import { getInterviewById } from '@/utils/actions';
import { useAuth } from '@/utils/contexts/UserProvider';
interface AttemptInterviewProps {
  interviewId: string;
}

const AttemptInterview = async ({ interviewId }: AttemptInterviewProps) => {
  const { user } = useAuth();
     const interview = await getInterviewById(interviewId);
     console.log(interview.questions)
  return (
    <Agent
        userName={user?.full_name || ""}
        userId={user?.id}
        interviewId={interviewId}
        type="interview"
        questions={interview.questions}
      />
  )
}

export default AttemptInterview