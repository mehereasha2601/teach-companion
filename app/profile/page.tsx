"use client"

import { useState } from "react"
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
    topics: "",
    language: "English",
    yearsTeaching: 5,

    // Student Information
    studentCount: 25,
    genderDistribution: "Even",
    attendance: 90,
    competenceLevel: "At Grade Level",

    // Challenges
    challenges: [] as string[],
    otherChallenge: "",
  })

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
                  <Button onClick={handleSubmit}>Continue to Video Upload</Button>
                )}
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
