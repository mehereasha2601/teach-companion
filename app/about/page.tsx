import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-purple-800 mb-6 text-center">About Teach-Spark</h1>

          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
                    <p className="text-gray-600 mb-4">
                      Teach-Spark was created with a simple but powerful mission: to help teachers continuously improve
                      their teaching methods through personalized, AI-powered feedback.
                    </p>
                    <p className="text-gray-600">
                      We believe that every teacher deserves access to high-quality professional development tools that
                      are convenient, affordable, and tailored to their specific teaching context.
                    </p>
                  </div>
                  <div>
                    <img
                      src="/placeholder.svg?key=6mrrv"
                      alt="Teachers collaborating"
                      className="rounded-lg shadow-md w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-700"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Research-Based</h3>
                  <p className="text-gray-600">
                    Our feedback methodology is grounded in educational research and best practices for effective
                    teaching and learning.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-700"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized</h3>
                  <p className="text-gray-600">
                    We understand that every classroom is unique. Our AI tailors feedback to your specific teaching
                    context and challenges.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-700"
                    >
                      <path d="M12 2v4" />
                      <path d="M12 18v4" />
                      <path d="m4.93 4.93 2.83 2.83" />
                      <path d="m16.24 16.24 2.83 2.83" />
                      <path d="M2 12h4" />
                      <path d="M18 12h4" />
                      <path d="m4.93 19.07 2.83-2.83" />
                      <path d="m16.24 7.76 2.83-2.83" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Actionable</h3>
                  <p className="text-gray-600">
                    We provide specific, practical strategies you can implement immediately to enhance your teaching
                    effectiveness.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Create Profile</h3>
                    <p className="text-sm text-gray-600">Tell us about your teaching context and specific challenges</p>
                  </div>

                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Share Video</h3>
                    <p className="text-sm text-gray-600">Upload a short video clip of your teaching in action</p>
                  </div>

                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                      3
                    </div>
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-gray-600">Our AI analyzes your teaching within your specific context</p>
                  </div>

                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-700 text-white flex items-center justify-center mx-auto mb-4">
                      4
                    </div>
                    <h3 className="font-semibold mb-2">Get Feedback</h3>
                    <p className="text-sm text-gray-600">Receive personalized insights and actionable strategies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Ready to enhance your teaching?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/profile">
                  <Button size="lg" className="bg-purple-700 hover:bg-purple-800">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="border-purple-300 text-purple-700">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
