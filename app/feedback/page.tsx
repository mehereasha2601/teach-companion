"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ThumbsUp, ThumbsDown, Download, Share2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FeedbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [teacherProfile, setTeacherProfile] = useState<any>(null)
  const [videoData, setVideoData] = useState<any>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [isMockData, setIsMockData] = useState(false)

  useEffect(() => {
    // Load teacher profile and video data from localStorage
    const profileData = localStorage.getItem("teacherProfile")
    const videoDataStr = localStorage.getItem("videoData")

    if (profileData) {
      setTeacherProfile(JSON.parse(profileData))
    }

    if (videoDataStr) {
      setVideoData(JSON.parse(videoDataStr))
    }

    const fetchFeedback = async () => {
      if (!profileData || !videoDataStr) return

      const profile = JSON.parse(profileData)
      const videoData = JSON.parse(videoDataStr)

      try {
        // Call our server-side API route instead of directly using the OpenAI API
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: videoData.transcript,
            teacherProfile: profile
          }),
        });

        const result = await response.json();

        if (result.success) {
          setFeedback(result.data)
          setIsMockData(result.isMockData || false)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to analyze video",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching feedback:", error)
        toast({
          title: "Error",
          description: "Failed to generate feedback. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Call the function
    fetchFeedback()
  }, [toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-700 mx-auto" />
          <h2 className="text-2xl font-semibold text-purple-800">Analyzing Your Teaching Video</h2>
          <p className="text-gray-600 max-w-md">
            Our AI is carefully reviewing your video and generating personalized feedback based on your teaching
            context...
          </p>
        </div>
      </div>
    )
  }

  // Helper function to render feedback items with emojis
  const renderFeedbackItem = (item: string) => {
    // Extract emoji if present
    let emoji = ""
    let content = item

    if (item.includes("✅")) {
      emoji = "✅"
      content = item.replace("✅", "").trim()
    } else if (item.includes("⏳")) {
      emoji = "⏳"
      content = item.replace("⏳", "").trim()
    } else if (item.includes("⛔")) {
      emoji = "⛔"
      content = item.replace("⛔", "").trim()
    }

    // Split into title and details if there's a colon
    const parts = content.split(":")
    const title = parts[0].trim()
    const details = parts.slice(1).join(":").trim()

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          {emoji && <span className="text-lg">{emoji}</span>}
          <h4 className="font-medium">{title}</h4>
        </div>
        {details && (
          <div className="pl-6 text-gray-700">
            <p>{details}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">Your Teaching Feedback</h1>
          <p className="text-gray-600 mb-8 text-center">AI-powered insights tailored to your teaching context</p>

          {isMockData && (
            <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
              <AlertDescription className="text-amber-700">
                This is sample feedback data. To get real AI-powered analysis, please add your OpenAI API key in the
                environment variables.
              </AlertDescription>
            </Alert>
          )}

          {feedback && (
            <>
              <Card className="shadow-lg mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Overall Feedback</CardTitle>
                      <CardDescription>Based on 10th grade English focused on evidence-based writing</CardDescription>
                    </div>
                    {videoData?.videoId && (
                      <div className="h-16 w-28 relative overflow-hidden rounded-md shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${videoData.videoId}/0.jpg`}
                          alt="Video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6 leading-relaxed">{feedback.overallFeedback}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-green-700">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {feedback.summary.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-gray-700">
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-amber-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-amber-700">Areas for Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {feedback.summary.areasForImprovement.map((area: string, index: number) => (
                            <li key={index} className="text-gray-700">
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-red-700">Avoid/Rethink</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {feedback.summary.avoidRethink.map((item: string, index: number) => (
                            <li key={index} className="text-gray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Feedback</h3>

                  <Tabs defaultValue="planning" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="planning">Planning & Preparation</TabsTrigger>
                      <TabsTrigger value="environment">Classroom Environment</TabsTrigger>
                      <TabsTrigger value="instruction">Instruction</TabsTrigger>
                    </TabsList>

                    <TabsContent value="planning" className="mt-4">
                      <div className="space-y-6 p-4 bg-white rounded-md border">
                        <h3 className="font-semibold text-lg text-purple-800">DOMAIN 1: PLANNING AND PREPARATION</h3>
                        <div className="space-y-8">
                          <div>
                            <h4 className="font-medium text-purple-700 mb-3">🔹 Strengths</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.planning
                                .filter((item: string) => item.includes("✅"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-amber-700 mb-3">🔹 Areas for Improvement</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.planning
                                .filter((item: string) => item.includes("⏳"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-700 mb-3">🔹 Avoid / Rethink</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.planning
                                .filter((item: string) => item.includes("⛔"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="environment" className="mt-4">
                      <div className="space-y-6 p-4 bg-white rounded-md border">
                        <h3 className="font-semibold text-lg text-purple-800">DOMAIN 2: CLASSROOM ENVIRONMENT</h3>
                        <div className="space-y-8">
                          <div>
                            <h4 className="font-medium text-purple-700 mb-3">🔹 Strengths</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.environment
                                .filter((item: string) => item.includes("✅"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-amber-700 mb-3">🔹 Areas for Improvement</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.environment
                                .filter((item: string) => item.includes("⏳"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-700 mb-3">🔹 Avoid / Rethink</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.environment
                                .filter((item: string) => item.includes("⛔"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="instruction" className="mt-4">
                      <div className="space-y-6 p-4 bg-white rounded-md border">
                        <h3 className="font-semibold text-lg text-purple-800">DOMAIN 3: INSTRUCTION</h3>
                        <div className="space-y-8">
                          <div>
                            <h4 className="font-medium text-purple-700 mb-3">🔹 Strengths</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.instruction
                                .filter((item: string) => item.includes("✅"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-amber-700 mb-3">🔹 Areas for Improvement</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.instruction
                                .filter((item: string) => item.includes("⏳"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-700 mb-3">🔹 Avoid / Rethink</h4>
                            <div className="space-y-6 pl-2">
                              {feedback.domains.instruction
                                .filter((item: string) => item.includes("⛔"))
                                .map((item: string, index: number) => (
                                  <div key={index} className="space-y-2">
                                    {renderFeedbackItem(item)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">Was this feedback helpful?</p>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="sr-only">Helpful</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ThumbsDown className="h-4 w-4" />
                      <span className="sr-only">Not helpful</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="h-4 w-4 mr-1" />
                      <span>Download PDF</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => router.push("/video")}>
                  Upload Another Video
                </Button>
                <Button onClick={() => router.push("/")} className="bg-purple-700 hover:bg-purple-800">
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
