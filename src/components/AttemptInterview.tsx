import React from 'react'
import Agent from '@/components/Agent';
import { getInterviewById } from '@/utils/actions';
interface AttemptInterviewProps {
  interviewId: string;
}

const AttemptInterview = async ({ interviewId }: AttemptInterviewProps) => {
     const interview = await getInterviewById(interviewId);
     console.log(interview.questions)
  return (
    <Agent
        userName={"Dhruba Bhattacharyya"}
        userId={"175c49be-e08e-4716-850e-fc698a47524c"}
        interviewId={interviewId}
        type="interview"
        questions={interview.questions}
      />
  )
}

export default AttemptInterview