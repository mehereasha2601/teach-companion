"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { getYouTubeTranscript } from "@/lib/youtube"

export default function VideoUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoId, setVideoId] = useState("")
  const [timeRange, setTimeRange] = useState([0, 5])
  const [isLoading, setIsLoading] = useState(false)
  const [teacherProfile, setTeacherProfile] = useState<any>(null)

  useEffect(() => {
    // Load teacher profile from localStorage
    const profileData = localStorage.getItem("teacherProfile")
    if (profileData) {
      setTeacherProfile(JSON.parse(profileData))
    }
  }, [])

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setYoutubeUrl(url)
    const id = extractVideoId(url)
    setVideoId(id || "")
  }

  const handleTimeRangeChange = (value: number[]) => {
    setTimeRange(value)
  }

  const handleSubmit = async () => {
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Now using the real transcript extraction functionality
      const transcript = await getYouTubeTranscript(videoId)
      
      if (!transcript || transcript.trim().length === 0) {
        throw new Error("Could not extract transcript from this video")
      }

      // Store video data in localStorage
      localStorage.setItem(
        "videoData",
        JSON.stringify({
          videoId,
          timeRange,
          url: youtubeUrl,
          transcript,
        }),
      )

      toast({
        title: "Transcript extracted successfully",
        description: "Proceeding to feedback analysis",
      })

      router.push("/feedback")
    } catch (error) {
      console.error("Error processing video:", error)
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to process the video: ${error.message}` 
          : "Failed to process the video. Please try again or try another video that has captions available.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">Video Analysis</h1>
          <p className="text-gray-600 mb-8 text-center">Provide a YouTube link to your teaching video for analysis</p>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Video Input</CardTitle>
              <CardDescription>Share a short video (1-5 minutes) of your teaching for AI analysis</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Video URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={handleUrlChange}
                />
                <p className="text-sm text-gray-500">Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
              </div>

              {videoId && (
                <div className="space-y-4">
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md"
                    ></iframe>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Relevant Time Range (minutes): {timeRange[0]} - {timeRange[1]}
                    </Label>
                    <Slider
                      min={0}
                      max={10}
                      step={0.5}
                      value={timeRange}
                      onValueChange={handleTimeRangeChange}
                      className="py-4"
                    />
                    <p className="text-sm text-gray-500">
                      Select the specific portion of the video you want analyzed (up to 5 minutes recommended)
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-purple-800 mb-2">Teaching Context Summary</h3>
                {teacherProfile ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Subject:</span> {teacherProfile.subject}
                    </p>
                    <p>
                      <span className="font-medium">Grade Level:</span> {teacherProfile.grade}
                    </p>
                    <p>
                      <span className="font-medium">Topics:</span> {teacherProfile.topics || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium">Key Challenges:</span>{" "}
                      {teacherProfile.challenges.join(", ") || "None specified"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No teaching profile data available.</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/profile")}>
                Back to Profile
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!videoId || isLoading}
                className="bg-purple-700 hover:bg-purple-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Video
                  </>
                ) : (
                  "Analyze Video"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
