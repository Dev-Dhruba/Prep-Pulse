import AttemptInterview from '@/components/AttemptInterview';

const InterviewId = async ({ params }:  RouteParams) => {
  const { id } = await params;

  return (
    <div>
       <AttemptInterview interviewId={id}/>
    </div>
  );
};

export default InterviewId;