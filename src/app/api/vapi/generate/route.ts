import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  return Response.json({ success: true, data: "Thank you" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
              The job role is ${role}.
              The job experience level is ${level}.
              The tech stack used in the job is: ${techstack}.
              The focus between behavioural and technical questions should lean towards: ${type}.
              The amount of questions required is: ${amount}.
              Please return only the questions, without any additional text.
              The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
              Return the questions formatted like this:
              ["Question 1", "Question 2", "Question 3"]
          `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","), // assuming your column is of type text[]
      questions: JSON.parse(questions), // assuming your column is of type jsonb
      userid: userid, // make sure this matches the column name in Supabase
      finalized: true,
      created_at: new Date().toISOString(), // should match timestamp column
    };

    const { data, error } = await supabase
      .from("interviews")
      .insert([interview]);

    if (error) {
      console.error("Error inserting interview:", error);
    } else {
      console.log("Interview inserted:", data);
    }

    return Response.json({success: true}, {status: 200})

  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
