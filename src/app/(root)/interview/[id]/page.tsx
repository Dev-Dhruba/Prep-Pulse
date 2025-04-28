import Agent from '@/components/Agent';
import React from 'react';
import { getInterviewById } from '@/utils/actions';

const InterviewId = async ({ params }:  RouteParams) => {
  const { id } = await params;
  const interview = await getInterviewById(id);
  console.log(interview.questions)
  console.log(id)


  return (
    <div>
        <Agent
        userName={"Dhruba Bhattacharyya"}
        userId={"175c49be-e08e-4716-850e-fc698a47524c"}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </div>
  );
};

export default InterviewId;