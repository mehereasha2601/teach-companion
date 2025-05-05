import OpenAI from "openai"

// Updated mock feedback data with the exact content provided
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
      "Respectful interactions and relationships: ✅ Caring tone and inclusivity - Transcript: \"I don't want to give away the killer because some of you might read it.\" → Demonstrates deep respect for students' interests and emotional engagement with literature.",
      'High expectations and intellectual engagement: ✅ Student validation and encouragement - Transcript: "It forced you to think more." / "That\'s what I want to hear." → You affirm student effort, building confidence with complex language use.',
      'Classroom procedures and time management: ⏳ Reduce use of "you kids" - Transcript: "Let me show you kids how I would use the sentence frames." Suggestion: Shift to "writers," "scholars," or "thinkers" to foster academic identity. Impact: Elevates classroom tone and student self-perception.',
      'Student behavior management: ⏳ Increase student role ownership in group structures - Transcript: "You can work at your tables collectively..." Suggestion: Assign rotating roles (e.g., Evidence Collector, Connector, Writer, Speaker) with responsibilities tied to sentence frame use. Impact: Promotes equity in contribution, especially in large classrooms.',
      'Classroom procedures and time management: ⏳ Reinforce routines for collaboration transitions - Transcript: Transition into table writing felt open-ended. Suggestion: Preview expectations (e.g., "First discuss, then write. You\'ll each share 1 quote before writing."). Impact: Helps off-task students know exactly where to begin.',
      'High expectations and intellectual engagement: ⛔ Avoid repeated informal phrasing that dilutes high expectations - Transcript: "You kids…" repeated. Rethink: Adopt phrases that align with your high intellectual goals (e.g., "As analytical writers, we…").',
    ],
    instruction: [
      'Quality of explanations and scaffolding: ✅ Strong instructional modeling with reading - Transcript: "So this Doug character...Let me explain how I\'d write about it." → Personalized modeling invites student connection and gives a concrete mentor text from your own writing.',
      'Communication of purpose and directions: ✅ Academic vocabulary support embedded or defined - Transcript: "Emblazoned — meaning big, bright…" → Verbal scaffolding builds academic language and closes vocabulary gaps.',
      'Communication of purpose and directions: ⏳ Clarify learning objective and success criteria - Transcript: The objective is implied, not explicit. Suggestion: State goal: "By the end of today, you\'ll write 4 sentences that include a sentence frame, a quote, and an explanation of your thinking." Impact: Empowers students to self-assess and aim higher.',
      'Discussion techniques and questioning: ⏳ Expand questioning techniques with student reasoning - Transcript: "Why do you think?" was asked once, but not followed through. Suggestion: Use layered questions: "What makes you think that?" → "What part of the text shaped this idea?" Impact: Encourages deeper discourse and critical analysis.',
      'Responsive teaching and assessment use: ⏳ Use more structured reflection on learning - Transcript: "How did it feel using sentence frames?" was asked at the end. Suggestion: Add sentence starters for reflection: "Using ___ helped my thinking because..." Impact: Builds metacognitive awareness about writing structure.',
      'Responsive teaching and assessment use: ⛔ Don\'t stop at surface-level feedback - Transcript: "It forced you to work more." :: "That\'s what I want to hear." No follow-up. Rethink: Ask for specifics: "What was challenging about using the frame?" or "Did a frame help your evidence make more sense?" Impact: Turns praise into instructional opportunity.',
      'Student engagement and participation: ⛔ Avoid relying solely on post-writing reflections - Transcript: Whole-class reflection occurs only at end. Rethink: Add a mid-task reflection prompt or mini-pause to share sentence examples aloud. Example: "Pause! Share one sentence out loud that includes both a frame and evidence." Impact: Re-engages off-task students and promotes immediate revision.',
    ],
  },
}

// Create a .env.local file in the root directory with OPENAI_API_KEY
export async function analyzeTeachingVideo(transcript: string, teacherProfile: any) {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY

    // If no API key is available, return mock data with a warning
    if (!apiKey) {
      console.warn("OpenAI API key not found. Using mock feedback data instead.")
      return {
        success: true,
        data: mockFeedbackData,
        isMockData: true,
      }
    }

    // Create the OpenAI client with the API key
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Prepare the prompt for the OpenAI model
    const prompt = `
      You are an expert teaching coach with years of experience observing and providing feedback to teachers.
      
      Analyze the following teaching transcript and provide detailed, actionable feedback.
      
      TEACHER PROFILE:
      ${JSON.stringify(teacherProfile, null, 2)}
      
      TRANSCRIPT:
      ${transcript}
      
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
    `

    console.log("Using OpenAI API with key:", apiKey ? `${apiKey.substring(0, 5)}...` : 'Not found');

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

    return {
      success: true,
      data: parsedFeedback,
      isMockData: false,
    }
  } catch (error) {
    console.error("Error analyzing teaching video:", error)

    // If there's an error with the API call, fall back to mock data
    return {
      success: true,
      data: mockFeedbackData,
      isMockData: true,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

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
