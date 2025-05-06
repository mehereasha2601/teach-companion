"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function TeacherProfileForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("teacher-info")
  const [formProgress, setFormProgress] = useState(33)
  const [formData, setFormData] = useState({
    // Teacher Information
    name: "",
    grade: "",
    subject: "",
    location: "",
    country: "",
    topics: "",
    language: "English",
    yearsTeaching: 5,
    transcript: "",
    numberOfLectures: 1,
    duration: 45,
    // Student Information
    studentCount: 25,
    genderDistribution: "Even",
    attendance: 90,
    competenceLevel: "At Grade Level",

    // Challenges
    challenges: [] as string[],
    otherChallenge: "",
  })

  // Declare the topic state
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleChallengeToggle = (value: string) => {
    setFormData((prev) => {
      const challenges = [...prev.challenges]
      if (challenges.includes(value)) {
        return { ...prev, challenges: challenges.filter((c) => c !== value) }
      } else {
        return { ...prev, challenges: [...challenges, value] }
      }
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "teacher-info") setFormProgress(33)
    else if (value === "student-info") setFormProgress(66)
    else if (value === "challenges") setFormProgress(100)
  }

  const handleNext = () => {
    if (activeTab === "teacher-info") {
      if (!formData.name || !formData.grade || !formData.subject) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }
      setActiveTab("student-info")
      setFormProgress(66)
    } else if (activeTab === "student-info") {
      setActiveTab("challenges")
      setFormProgress(100)
    }
  }

  const handlePrevious = () => {
    if (activeTab === "student-info") {
      setActiveTab("teacher-info")
      setFormProgress(33)
    } else if (activeTab === "challenges") {
      setActiveTab("student-info")
      setFormProgress(66)
    }
  }

  const handleSubmit = () => {
    // In a real application, we would validate and save the form data
    // For now, we'll just navigate to the next page
    localStorage.setItem("teacherProfile", JSON.stringify(formData))
    router.push("/video")
  }

  const handleGeneratePlan = async () => {
    setLoading(true);
    setResponse("");

    // Construct the prompt using the full structure provided
    const prompt = `
      Create a detailed lecture plan for teaching  ${formData.topics} topic in ${formData.subject} to ${formData.grade} grade students. The class is based  with ${formData.studentCount} students with (${formData.genderDistribution}) gender distribution. The teacher has ${formData.yearsTeaching} years of experience, and the class has ${formData.attendance} percent attendance with ${formData.competenceLevel} competence level. Current challenges include: ${formData.challenges.join(", ")}.

      Please structure your response EXACTLY as follows:

      Overview:
      - [Write 2-3 bullet points about the topic's importance and relevance]
      - [Include how it connects to previous and future learning]
      - [Add any key context for this specific class]

      Learning Objectives:
      - [List 3-5 specific, measurable objectives]
      - [Each objective should be achievable within the class period]
      - [Include objectives for different learning levels]

      Materials:
      - [List all required physical materials]
      - [Include any digital resources needed]
      - [Note any preparation required]

      Timeline:
      - [Break down the class into 5-10 minute segments]
      - [Include specific activities for each segment]
      - [Note when to check for understanding]
      - [Include time for questions and discussion]

      Assessment:
      - [List specific ways to check understanding]
      - [Include quick assessment methods]
      - [Add questions to ask students]
      - [Note activities to verify learning]

      Important: 
      1. Start each section with the exact header shown above
      2. Use bullet points (starting with -) for all items
      3. Keep each bullet point concise and clear
      4. Maintain this exact structure for proper parsing
    `;

    // Log the values used in the API call
    console.log("API Call Prompt:", prompt);
    console.log("Form Data:", {
        subject: formData.subject,
        grade: formData.grade,
        location: formData.location,
        country: formData.country,
        studentCount: formData.studentCount,
        genderDistribution: formData.genderDistribution,
        topic: formData.topics,
        yearsTeaching: formData.yearsTeaching,
        attendance: formData.attendance,
        competenceLevel: formData.competenceLevel,
        challenges: formData.challenges,
    });

    console.log("Sending request to Google Gemini API with prompt:", prompt);

    try {
        // Call our Next.js API route to generate the lecture plan
        const res = await fetch('/api/generate-lecture-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        console.log("Lecture Plan API Status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Lecture Plan Error:", errorData);
          throw new Error(errorData.error || 'Failed to generate lecture plan');
        }

        const apiData = await res.json();
        console.log("Lecture Plan API Data:", apiData);
        // Extract the generated text from Gemini's content.parts
        const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          setResponse(rawText);
        } else {
          console.warn('No text found in Gemini response:', apiData);
          setResponse(JSON.stringify(apiData));
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        toast({
            title: "Error",
            description: "There was an error generating the lecture plan.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};

  const handleContinueToUpload = () => {
    handleSubmit(); // Save data and continue to upload video
  }

  // Helper to parse the raw lecture plan text into sections
  const parseLecturePlan = (text: string): Record<string, string[]> => {
    const lines = text.split('\n');
    const sections: Record<string, string[]> = {};
    let current = '';
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('**') && trimmed.endsWith(':**')) {
        current = trimmed.slice(2, -3);
        sections[current] = [];
      } else if (trimmed.startsWith('*')) {
        let itemText = trimmed.replace(/^\*\s*-?\s*/, '').trim();
        itemText = itemText.replace(/\*\*/g, '').trim();
        if (current && sections[current] && itemText) {
          sections[current].push(itemText);
        }
      }
    });
    return sections;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">Teacher Profile</h1>
          <p className="text-gray-600 mb-8 text-center">
            Help us understand your teaching context to provide more relevant feedback
          </p>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle>Create Your Teaching Profile</CardTitle>
              <CardDescription>
                This information helps us tailor our feedback to your specific teaching environment
              </CardDescription>
              <Progress value={formProgress} className="h-2 mt-4" />
            </CardHeader>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="teacher-info">Teacher Info</TabsTrigger>
                  <TabsTrigger value="student-info">Student Info</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="teacher-info" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade">
                          Grade Level <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                          <SelectTrigger id="grade">
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="K-2">K-2 (Kindergarten - 2nd Grade)</SelectItem>
                            <SelectItem value="3-5">3-5 (Elementary)</SelectItem>
                            <SelectItem value="6-8">6-8 (Middle School)</SelectItem>
                            <SelectItem value="9-12">9-12 (High School)</SelectItem>
                            <SelectItem value="higher-ed">Higher Education</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="language-arts">Language Arts</SelectItem>
                            <SelectItem value="social-studies">Social Studies</SelectItem>
                            <SelectItem value="foreign-language">Foreign Language</SelectItem>
                            <SelectItem value="art">Art</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="physical-education">Physical Education</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfLectures">Number of Lectures</Label>
                        <Input
                          id="numberOfLectures"
                          type="number"
                          min="1"
                          value={formData.numberOfLectures}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (in minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={formData.duration}
                          onChange={(e) => handleInputChange("duration", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topics">Topics Being Covered</Label>
                      <Textarea
                        id="topics"
                        placeholder="E.g., Fractions, Photosynthesis, Shakespeare, etc."
                        value={formData.topics}
                        onChange={(e) => handleInputChange("topics", e.target.value)}
                      />
                      <p className="text-sm text-gray-500">Separate multiple topics with commas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language of Instruction</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleInputChange("language", value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Mandarin">Mandarin</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="years-teaching">Years Teaching: {formData.yearsTeaching}</Label>
                        <Slider
                          id="years-teaching"
                          min={0}
                          max={40}
                          step={1}
                          value={[formData.yearsTeaching]}
                          onValueChange={(value) => handleInputChange("yearsTeaching", value[0])}
                          className="py-4"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="student-info" className="space-y-4 mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-count">Number of Students</Label>
                        <Input
                          id="student-count"
                          type="number"
                          min={1}
                          value={formData.studentCount}
                          onChange={(e) => handleInputChange("studentCount", Number.parseInt(e.target.value) || 0)}
                        />
                        <p className="text-sm text-gray-500">Typical class sizes: 15-35 students</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender-distribution">Gender Distribution</Label>
                        <Select
                          value={formData.genderDistribution}
                          onValueChange={(value) => handleInputChange("genderDistribution", value)}
                        >
                          <SelectTrigger id="gender-distribution">
                            <SelectValue placeholder="Select distribution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Even">Roughly Even</SelectItem>
                            <SelectItem value="More Boys">More Boys</SelectItem>
                            <SelectItem value="More Girls">More Girls</SelectItem>
                            <SelectItem value="All Boys">All Boys</SelectItem>
                            <SelectItem value="All Girls">All Girls</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attendance">Expected Attendance: {formData.attendance}%</Label>
                      <Slider
                        id="attendance"
                        min={50}
                        max={100}
                        step={5}
                        value={[formData.attendance]}
                        onValueChange={(value) => handleInputChange("attendance", value[0])}
                        className="py-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competence-level">Grade Level Competence</Label>
                      <Select
                        value={formData.competenceLevel}
                        onValueChange={(value) => handleInputChange("competenceLevel", value)}
                      >
                        <SelectTrigger id="competence-level">
                          <SelectValue placeholder="Select competence level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Below Grade Level">Below Grade Level</SelectItem>
                          <SelectItem value="At Grade Level">At Grade Level</SelectItem>
                          <SelectItem value="Mixed">Mixed Abilities</SelectItem>
                          <SelectItem value="Above Grade Level">Above Grade Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="challenges" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <Label>Common Challenges (Select all that apply)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-engagement"
                          checked={formData.challenges.includes("Student engagement")}
                          onCheckedChange={() => handleChallengeToggle("Student engagement")}
                        />
                        <Label htmlFor="challenge-engagement" className="font-normal">
                          Student engagement
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-attendance"
                          checked={formData.challenges.includes("Attendance issues")}
                          onCheckedChange={() => handleChallengeToggle("Attendance issues")}
                        />
                        <Label htmlFor="challenge-attendance" className="font-normal">
                          Attendance issues
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-behavior"
                          checked={formData.challenges.includes("Behavior management")}
                          onCheckedChange={() => handleChallengeToggle("Behavior management")}
                        />
                        <Label htmlFor="challenge-behavior" className="font-normal">
                          Behavior management
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-learning"
                          checked={formData.challenges.includes("Diverse learning needs")}
                          onCheckedChange={() => handleChallengeToggle("Diverse learning needs")}
                        />
                        <Label htmlFor="challenge-learning" className="font-normal">
                          Diverse learning needs
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-technology"
                          checked={formData.challenges.includes("Technology limitations")}
                          onCheckedChange={() => handleChallengeToggle("Technology limitations")}
                        />
                        <Label htmlFor="challenge-technology" className="font-normal">
                          Technology limitations
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-time"
                          checked={formData.challenges.includes("Time constraints")}
                          onCheckedChange={() => handleChallengeToggle("Time constraints")}
                        />
                        <Label htmlFor="challenge-time" className="font-normal">
                          Time constraints
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge-other"
                          checked={formData.challenges.includes("Other")}
                          onCheckedChange={() => handleChallengeToggle("Other")}
                        />
                        <Label htmlFor="challenge-other" className="font-normal">
                          Other
                        </Label>
                      </div>
                    </div>

                    {formData.challenges.includes("Other") && (
                      <div className="space-y-2">
                        <Label htmlFor="other-challenge">Please specify other challenge(s)</Label>
                        <Textarea
                          id="other-challenge"
                          placeholder="Describe your specific challenge"
                          value={formData.otherChallenge}
                          onChange={(e) => handleInputChange("otherChallenge", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>

              <CardFooter className="flex justify-between p-6 pt-0">
                {activeTab !== "teacher-info" ? (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                {activeTab !== "challenges" ? (
                  <Button onClick={handleNext}>Next</Button>
                ) : (
                  <>
                    <Button onClick={handleGeneratePlan} disabled={loading}>
                      {loading ? "Generating..." : "Generate Lecture Plan"}
                    </Button>
                    <Button onClick={handleContinueToUpload}>
                      Continue to Video Upload
                    </Button>
                  </>
                )}
              </CardFooter>
            </Tabs>
          </Card>

          {response && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
                Generated Lecture Plan
              </h2>
              {(() => {
                const sections = parseLecturePlan(response as string);
                const order = ["Overview", "Learning Objectives", "Materials", "Preparation", "Timeline", "Assessment"];
                return order.map((section) => {
                  const items = sections[section] || [];
                  if (items.length === 0) return null;
                  return (
                    <div key={section} className="mb-6">
                      <h3 className="text-xl font-semibold text-purple-700 mb-2">{section}</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {items.map((item, idx) => (
                          <li key={idx} className="text-gray-800">{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Default content if response is empty */}
          {!response && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
                Generated Lecture Plan
              </h2>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Overview</h3>
              <p>Photosynthesis is the foundation of most food chains on Earth, explaining where plants get their food and energy.</p>
              <p>Understanding photosynthesis connects to prior learning about plants (parts, needs) and sets the stage for future learning about ecosystems and the carbon cycle.</p>
              <p>With low attendance and below-grade-level competence, the lesson needs to be highly engaging, simplified, and reinforced with visual aids and hands-on activities, focusing on core concepts. The all-boys class may respond well to competitive or active learning strategies.</p>

              <h3 className="text-xl font-semibold text-purple-700 mb-2">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Students will be able to identify the three main ingredients needed for photosynthesis (sunlight, water, carbon dioxide) with 80% accuracy (basic understanding).</li>
                <li>Students will be able to describe, in simple terms, what plants make during photosynthesis (sugar/food and oxygen) (intermediate understanding).</li>
                <li>Students will be able to explain why photosynthesis is important for plants to grow and for animals (including humans) to breathe, using at least one sentence (advanced understanding).</li>
                <li>Students will be able to match vocabulary words (Photosynthesis, Chlorophyll, Sunlight, Oxygen, Carbon Dioxide) with their definitions with 70% accuracy.</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-700 mb-2">Materials</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Large poster or whiteboard to draw/diagram on</li>
                <li>Markers of different colors (green, blue, yellow)</li>
                <li>Pictures/illustrations of plants, sunlight, water, carbon dioxide sources (e.g., animals breathing out), oxygen release</li>
                <li>Optional: A small plant in a clear container to observe (if available)</li>
                <li>Worksheet with fill-in-the-blanks or matching questions related to the 3 main ingredients and the outputs of photosynthesis.</li>
                <li>Vocabulary cards with terms: Photosynthesis, Chlorophyll, Sunlight, Oxygen, Carbon Dioxide, Water.</li>
                <li>Chart paper/markers for group activity.</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-700 mb-2">Timeline</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>(5 minutes) Introduction & Hook: Start with a question: "Where does your food come from? Where do plants get *their* food?" Brief discussion and introduction of the topic.</li>
                <li>(10 minutes) Explaining the Ingredients: Draw a simple plant on the board. Use different colored markers to show sunlight (yellow), water being absorbed by roots (blue), and carbon dioxide entering the leaves (using visual cues from poster). Explain where each ingredient comes from and its role in photosynthesis.</li>
                <li>(10 minutes) Photosynthesis Process (Simplified): Explain that the plant uses sunlight, water, and carbon dioxide to make its own food (sugar) and releases oxygen. Use simple language. "The plant is like a tiny food factory using sunlight as power."</li>
                <li>(10 minutes) Group Activity: "The Photosynthesis Story." Divide students into small groups (8 students per group). Each group creates a short skit showing one stage of the process.</li>
                <li>(5 minutes) Checking for Understanding: Ask quick questions. "What are the three ingredients plants need? What do plants make? What do *we* get from plants?". Thumbs up/down activity for simple concept checks.</li>
                <li>(10 minutes) Hands-on Activity: Filling the blanks on the worksheets. Review worksheets with the whole class, ensuring that all students understand each question.</li>
                <li>(5 minutes) Vocabulary Matching: Use the vocabular cards to play a matching game. Students match terms to their definitions in pairs.</li>
                <li>(5 minutes) Wrap-up & Summary: Reiterate the main points: plants need sunlight, water, and carbon dioxide to make food and release oxygen. Explain why this is important for us.</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-700 mb-2">Assessment</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Observation: Observe student participation during discussions and group activity.</li>
                <li>Thumbs Up/Down: Use quick thumbs up/down to gauge understanding during explanation. "Do plants need sunlight? (Thumbs up or down)."</li>
                <li>Worksheet Review: Collect and review worksheets to assess understanding of key concepts. Did they correctly identify the inputs and outputs of photosynthesis?</li>
                <li>Questioning: Ask specific questions during and after the lesson:</li>
                <li>What is the job of the leaves?</li>
                <li>What is chlorophyll?</li>
                <li>Why is oxygen important to us?</li>
                <li>Group Activity Feedback: Observe the student skits for understanding. How accurately do they portray the photosynthesis process?</li>
              </ul>

              <p>If the API fails, please ensure you are using a valid API key for the Google Gemini service.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
