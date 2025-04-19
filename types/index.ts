interface AgentProps {
    userName: string;
    userId?: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
  }

