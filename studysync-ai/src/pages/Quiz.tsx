import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { Databases, Query } from "appwrite"
import { client } from "../lib/appwrite"

interface Question {
  $id: string
  question: string
  options: string[]
  correctAnswer: number
}

const Quiz: React.FC = () => {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timer, setTimer] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const databases = new Databases(client)

        // Fetch quiz questions for the user's domain
        const questionsData = await databases.listDocuments("YOUR_DATABASE_ID", "quiz_questions", [
          Query.equal("domain", user.domain),
          Query.limit(10),
        ])

        setQuestions(questionsData.documents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching quiz questions:", error)
        setError("Failed to load quiz questions. Please try again later.")
        setLoading(false)
      }
    }

    fetchQuizQuestions()
  }, [user])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizStarted && timer > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0 && !quizCompleted) {
      handleNextQuestion()
    }
    return () => clearInterval(interval)
  }, [quizStarted, timer, quizCompleted])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setTimer(30)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = async () => {
    if (selectedAnswer !== null) {
      const currentQuestion = questions[currentQuestionIndex]
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer

      if (isCorrect) {
        setScore(score + 1)
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setTimer(30)
    } else {
      setQuizCompleted(true)

      // Save quiz result
      try {
        const databases = new Databases(client)
        await databases.createDocument("YOUR_DATABASE_ID", "quiz_scores", "unique()", {
          userId: user.$id,
          score: score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0),
          totalQuestions: questions.length,
          date: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error saving quiz result:", error)
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">{error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Quiz</h2>

        {!quizStarted ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to start the quiz?</h3>
            <button
              onClick={handleStartQuiz}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Quiz
            </button>
          </div>
        ) : !quizCompleted ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="text-lg font-semibold">Time left: {timer}s</div>
            </div>
            <p className="text-lg mb-4">{questions[currentQuestionIndex].question}</p>
            <div className="space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-2 rounded ${
                    selectedAnswer === index ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Quiz Completed!</h3>
            <p className="text-lg mb-4">
              Your score: {score} out of {questions.length}
            </p>
            <p className="text-indigo-600 font-semibold">{(score / questions.length) * 100}% Correct</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Quiz

