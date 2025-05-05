import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Mock feedback data for fallback
const mockFeedbackData = {
  overallFeedback:
    "Your lesson on evidence-based writing demonstrates strong content knowledge with clear identification of learning gaps and thoughtful resource use. You maintain a caring tone and provide strong instructional modeling. Consider differentiating materials for varied learners, improving transitions, and clarifying success criteria to further enhance student engagement and learning outcomes.",
  summary: {
    strengths: [
      "Clear identification of a learning gap",
      "Thoughtful resource use: Sentence frames and reading examples",
      "Caring tone and inclusivity",
      "Student validation and encouragement",
      "Strong instructional modeling with reading",
      "Academic vocabulary support embedded or defined",
    ],
    areasForImprovement: [
      "Differentiate frames by skill level",
      "Plan for pacing and student transition time",
      "Integrate formative checkpoints",
      'Reduce use of "you kids"',
      "Increase student role ownership in group structures",
      "Reinforce routines for collaboration transitions",
      "Clarify learning objective and success criteria",
      "Expand questioning techniques with student reasoning",
      "Use more structured reflection on learning",
    ],
    avoidRethink: [
      "Overreliance on one-size-fits-all scaffolds",
      "Lack of tangible outcome descriptors",
      "Avoid repeated informal phrasing that dilutes high expectations",
      "Don't stop at surface-level feedback",
      "Avoid relying solely on post-writing reflections",
    ],
  },
  domains: {
    planning: [
      'Knowledge of content and pedagogy: ✅ Clear identification of a learning gap - Transcript: "We have a gap in our learning and how we can explain our thinking using evidence." → This shows strong content knowledge and purposeful lesson design.',
      'Use of resources and materials: ✅ Thoughtful resource use: Sentence frames and reading examples - Transcript: "These are called sentence starters or sentence frames... glue this into your journals…" → Providing reusable reference tools supports writing stamina and academic development.',
      'Knowledge of students and differentiation: ⏳ Differentiate frames by skill level - Transcript: One universal version of the sentence frames was given. Suggestion: Create "basic, proficient, advanced" versions. Add visual cues or prompts for EL or struggling learners. Impact: Increased accessibility and rigor for varied learners.',
      'Lesson design and coherence: ⏳ Plan for pacing and student transition time - Transcript: Transitions like "Now glue this in" lack time guidance or clarity. Suggestion: Build in visible timers, music cues, or countdowns ("You have 90 seconds to glue and open your journals"). Impact: Supports focus and reduces off-task behavior.',
      "Assessment integration: ⏳ Integrate formative checkpoints - Transcript: There's no mid-lesson check for understanding before students begin writing. Suggestion: Ask questions like: \"Show a thumbs-up if you know which sentence frame you'll use,\" or do whole-class planning of a response together. Impact: Allows real-time adjustment and supports mastery.",
      "Knowledge of students and differentiation: ⛔ Overreliance on one-size-fits-all scaffolds - Transcript: Same content and task presented to all students. Rethink: Offer optional challenge frames or open-ended prompts for your advanced learners.",
      'Assessment integration: ⛔ Lack of tangible outcome descriptors - Prompt: "Write four sentences…" without a model or rubric. Rethink: Provide a success checklist (e.g., 1 strong quote, 1 sentence frame, 1 explanation of thinking).',
    ],
    environment: [
      'Classroom culture and relationships: ✅ Caring tone and inclusivity - Transcript: "I appreciate the way you\'re all focused on your journals." → This positive reinforcement builds a supportive learning environment.',
      'Student engagement and motivation: ✅ Student validation and encouragement - Transcript: "Thank you for sharing... that\'s a great observation." → Acknowledging student contributions promotes participation and confidence.',
      'Classroom management: ⏳ Reduce use of "you kids" - Transcript: Multiple instances of "you kids" throughout the lesson. Suggestion: Use more respectful language like "scholars," "writers," or "class." Impact: Elevates academic identity and sets a tone of high expectations.',
      'Student ownership and agency: ⏳ Increase student role ownership in group structures - Transcript: Teacher-directed grouping without clear roles. Suggestion: Assign or have students select roles (e.g., facilitator, recorder, timekeeper) with clear responsibilities. Impact: Increases accountability and participation.',
      'Classroom procedures: ⏳ Reinforce routines for collaboration transitions - Transcript: "Get with your groups" without specific guidance. Suggestion: Create and practice a routine with visual cues for quick, quiet transitions (e.g., "When I say \'group up,\' you have 30 seconds to..."). Impact: Maximizes instructional time and reduces management issues.',
      'Communication style: ⛔ Avoid repeated informal phrasing that dilutes high expectations - Transcript: "Alright, you guys," "Okay, kiddos," etc. Rethink: Use academic language consistently to model the register you expect from students.',
    ],
    instruction: [
      'Clarity of communication: ✅ Strong instructional modeling with reading - Transcript: "Let me read this aloud... notice how I..." → Demonstrating the thinking process makes abstract concepts concrete for students.',
      'Academic language development: ✅ Academic vocabulary support embedded or defined - Transcript: "This is what we call evidence... it proves our thinking." → Explicitly teaching academic terminology builds language proficiency.',
      'Learning objectives: ⏳ Clarify learning objective and success criteria - Transcript: Objective not explicitly stated or referenced during lesson. Suggestion: Post and verbally highlight the learning target at beginning, middle, and end of lesson (e.g., "Today we will... so that we can..."). Impact: Focuses student effort and helps them monitor their own progress.',
      'Questioning techniques: ⏳ Expand questioning techniques with student reasoning - Transcript: Questions primarily focus on recall or basic comprehension. Suggestion: Add follow-up questions like "What makes you think that?" or "How does this evidence support your claim?" Impact: Deepens critical thinking and metacognitive awareness.',
      'Assessment and feedback: ⏳ Use more structured reflection on learning - Transcript: "What did we learn today?" without specific prompts. Suggestion: Provide sentence frames for exit tickets (e.g., "Today I learned ___ which will help me ___ in my writing."). Impact: Reinforces key learning and helps you gauge understanding.',
      'Depth of student thinking: ⛔ Don\'t stop at surface-level feedback - Transcript: "Good job" without specificity about what was good. Rethink: Name the specific strength ("I like how you connected your evidence directly to your claim by explaining...").',
      'Assessment design: ⛔ Avoid relying solely on post-writing reflections - Transcript: No checks for understanding until after writing is complete. Rethink: Build in multiple quick formative assessment points throughout the lesson.',
    ],
  },
};

// Helper function to parse the OpenAI response into structured data
function parseOpenAIResponse(text: string) {
  // This is a simplified parser - in a production app, you'd want more robust parsing
  const sections = {
    overallFeedback: "",
    summary: {
      strengths: [] as string[],
      areasForImprovement: [] as string[],
      avoidRethink: [] as string[],
    },
    domains: {
      planning: [] as string[],
      environment: [] as string[],
      instruction: [] as string[],
    },
  }

  // Extract overall feedback
  const overallMatch = text.match(/OVERALL FEEDBACK:([\s\S]*?)(?=STRENGTHS|$)/i)
  if (overallMatch) {
    sections.overallFeedback = overallMatch[1].trim()
  }

  // Extract strengths
  const strengthsMatch = text.match(/STRENGTHS:([\s\S]*?)(?=AREAS FOR IMPROVEMENT|$)/i)
  if (strengthsMatch) {
    sections.summary.strengths = strengthsMatch[1]
      .trim()
      .split(/\n-\s*/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim().replace(/^-\s*/, ""))
  }

  // Extract areas for improvement
  const improvementMatch = text.match(/AREAS FOR IMPROVEMENT:([\s\S]*?)(?=AVOID\/RETHINK|$)/i)
  if (improvementMatch) {
    sections.summary.areasForImprovement = improvementMatch[1]
      .trim()
      .split(/\n-\s*/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim().replace(/^-\s*/, ""))
  }

  // Extract avoid/rethink
  const avoidMatch = text.match(/AVOID\/RETHINK:([\s\S]*?)(?=DETAILED FEEDBACK|DOMAIN 1|$)/i)
  if (avoidMatch) {
    sections.summary.avoidRethink = avoidMatch[1]
      .trim()
      .split(/\n-\s*/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim().replace(/^-\s*/, ""))
  }

  // Extract domain 1: planning and preparation
  const domain1Match = text.match(/DOMAIN 1: PLANNING AND PREPARATION([\s\S]*?)(?=DOMAIN 2|$)/i)
  if (domain1Match) {
    sections.domains.planning = domain1Match[1]
      .trim()
      .split(/\n⛔|\n✅|\n⏳/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim())
  }

  // Extract domain 2: classroom environment
  const domain2Match = text.match(/DOMAIN 2: CLASSROOM ENVIRONMENT([\s\S]*?)(?=DOMAIN 3|$)/i)
  if (domain2Match) {
    sections.domains.environment = domain2Match[1]
      .trim()
      .split(/\n⛔|\n✅|\n⏳/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim())
  }

  // Extract domain 3: instruction
  const domain3Match = text.match(/DOMAIN 3: INSTRUCTION([\s\S]*?)(?=$)/i)
  if (domain3Match) {
    sections.domains.instruction = domain3Match[1]
      .trim()
      .split(/\n⛔|\n✅|\n⏳/)
      .filter((item: string) => item.trim())
      .map((item: string) => item.trim())
  }

  return sections
}

export async function POST(req: Request) {
  try {
    // Extract the transcript and teacher profile from the request
    const { transcript, teacherProfile } = await req.json();

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key is available, return mock data with a warning
    if (!apiKey) {
      console.warn("OpenAI API key not found in server environment. Using mock feedback data instead.");
      return NextResponse.json({
        success: true,
        data: mockFeedbackData,
        isMockData: true,
      });
    }

    // Create the OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Prepare the prompt for the OpenAI model
    const prompt = `
      You are an expert teaching coach with years of experience observing and providing feedback to teachers.
      
      Analyze the following teaching transcript and provide detailed, actionable feedback.
      
      TEACHER PROFILE:
      ${JSON.stringify(teacherProfile, null, 2)}
      
      TRANSCRIPT:
      ${transcript.replace(/"/g, '\\"')}
      
      Please provide feedback in the following format:
      
      OVERALL FEEDBACK:
      [A 2-3 sentence summary of the teaching observed, highlighting major strengths and 1-2 key areas for growth]
      
      STRENGTHS:
      - [Strength 1]
      - [Strength 2]
      - [Strength 3]
      - [Strength 4]
      - [Strength 5]
      - [Strength 6]
      
      AREAS FOR IMPROVEMENT:
      - [Area 1]
      - [Area 2]
      - [Area 3]
      - [Area 4]
      - [Area 5]
      - [Area 6]
      - [Area 7]
      - [Area 8]
      - [Area 9]
      
      AVOID/RETHINK:
      - [Issue 1]
      - [Issue 2]
      - [Issue 3]
      - [Issue 4]
      - [Issue 5]
      
      DETAILED FEEDBACK:
      
      DOMAIN 1: PLANNING AND PREPARATION
      [Provide 7 specific observations about planning and preparation, using the following format for each:]
      - ✅ [Strength]: [Evidence from transcript] → [Impact]
      - ⏳ [Area for improvement]: [Evidence from transcript] → [Specific suggestion] → [Expected impact]
      - ⛔ [Critical issue to avoid]: [Evidence from transcript] → [Why this should be reconsidered]
      
      DOMAIN 2: CLASSROOM ENVIRONMENT
      [Follow same format as Domain 1]
      
      DOMAIN 3: INSTRUCTION
      [Follow same format as Domain 1]
      
      For each observation, provide:
      1. Direct evidence from the transcript (quote or specific reference)
      2. Specific changes that could be implemented immediately
      3. The intended impact of these changes
      
      Please ensure your feedback is specific, actionable, and directly tied to evidence from the transcript.
    `;

    console.log("Using OpenAI API with key from server environment");

    // Make the actual API call with the OpenAI client
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert teaching coach providing detailed, actionable feedback." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Get the response text
    const responseText = completion.choices[0].message.content;

    // Parse the response into structured data
    const parsedFeedback = parseOpenAIResponse(responseText || "");

    return NextResponse.json({
      success: true,
      data: parsedFeedback,
      isMockData: false,
    });
  } catch (error) {
    console.error("Error analyzing teaching video:", error);

    // If there's an error with the API call, fall back to mock data
    return NextResponse.json({
      success: true,
      data: mockFeedbackData,
      isMockData: true,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
