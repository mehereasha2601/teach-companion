"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateLecturePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState("");

  useEffect(() => {
    // Retrieve the lecture plan data from localStorage
    const lecturePlanData = localStorage.getItem("lecturePlanData");
    if (lecturePlanData) {
      const data = JSON.parse(lecturePlanData);
      // Call the LLM API with the prompt
      const prompt = `
        As an expert in teaching and pedagogy, analyze the following lecture transcript and provide detailed feedback 
        for a ${data.grade} grade class. The class has ${data.number_of_students} students with ${data.percentage_of_girls} girls and ${data.percentage_of_boys} boys. 
        The attendance is ${data.attendance_percentage}, and the grade level competence is ${data.grade_level_competence}. 
        The teacher has been teaching this grade for ${data.teaching_tenure_years} years and faces challenges such as 
        ${data.classroom_challenges}.

        Lecture Transcript:
        ${data.lecture_transcript}

        Please structure your response EXACTLY as follows:
        ...
      `;

      // Simulate an API call to the LLM
      fetch('/api/llm', { method: 'POST', body: JSON.stringify({ prompt }) })
        .then(response => response.json())
        .then(data => {
          setOutput(data.response); // Assuming the response contains the output
          setLoading(false); // Set loading to false once the response is received
        })
        .catch(error => {
          console.error("Error calling LLM:", error);
          setLoading(false); // Stop loading on error
        });
    } else {
      // If no data is found, redirect back to the lecture plan page
      router.push('/lecture-plan');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">Loading...</h1>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-purple-800 mb-2 text-center">Lecture Plan Output</h1>
              <p className="text-gray-600 mb-8 text-center">{output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
