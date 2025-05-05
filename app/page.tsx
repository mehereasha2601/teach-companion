import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-purple-800">Teach-Spark</h1>
            <p className="text-xl text-gray-600 md:text-2xl">AI-powered feedback to elevate your teaching methods</p>
          </div>

          <div className="w-full max-w-5xl">
            <img
              src="/teaching-hero.svg"
              alt="Educational environment showing teachers and students"
              className="rounded-xl shadow-lg w-full object-cover h-[300px]"
            />
          </div>

          <Card className="w-full max-w-3xl bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Elevate Your Teaching Practice</h2>
                <p className="text-gray-600 text-center">
                  Teach-Spark helps you receive personalized feedback on your teaching methods through AI-powered video
                  analysis. Simply provide some context about your class, upload a short teaching video, and receive
                  tailored insights to enhance your teaching effectiveness.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                  <Link href="/profile">
                    <Button size="lg" className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-purple-300 text-purple-700">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <Card className="bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
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
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M8 13h2" />
                    <path d="M8 17h2" />
                    <path d="M14 13h2" />
                    <path d="M14 17h2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Simple Form</h3>
                <p className="text-gray-600">
                  Quick and intuitive form with smart defaults to capture your teaching context.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
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
                    <path d="m22 8-6 4 6 4V8Z" />
                    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Video Analysis</h3>
                <p className="text-gray-600">
                  Upload your teaching video or provide a YouTube link for AI-powered analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tailored Feedback</h3>
                <p className="text-gray-600">
                  Receive personalized insights based on your specific teaching context and challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
