import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { Databases, Query } from "appwrite"
import { client } from "../lib/appwrite"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Analytics: React.FC = () => {
  const { user } = useAuth()
  const [quizScores, setQuizScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const databases = new Databases(client)

        // Fetch user's quiz scores
        const scoresData = await databases.listDocuments("YOUR_DATABASE_ID", "quiz_scores", [
          Query.equal("userId", user.$id),
          Query.orderAsc("date"),
          Query.limit(10),
        ])

        setQuizScores(scoresData.documents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        setError("Failed to load analytics data. Please try again later.")
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [user])

  const chartData = {
    labels: quizScores.map((score) => new Date(score.date).toLocaleDateString()),
    datasets: [
      {
        label: "Quiz Scores",
        data: quizScores.map((score) => score.score),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Quiz Score Progression",
      },
    },
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
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quiz Score Progression</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Learning Strengths</h3>
          {/* Add a component or logic to display learning strengths */}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Areas for Improvement</h3>
          {/* Add a component or logic to display areas for improvement */}
        </div>
      </div>
    </Layout>
  )
}

export default Analytics

