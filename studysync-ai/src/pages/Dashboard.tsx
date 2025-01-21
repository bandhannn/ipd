import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { Databases, Query, type RealtimeResponseEvent } from "appwrite"
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

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState(0)
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recommendedResources, setRecommendedResources] = useState<any[]>([])
  const [quizScores, setQuizScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const databases = new Databases(client)

    const fetchDashboardData = async () => {
      try {
        // Fetch user progress
        const progressData = await databases.listDocuments("YOUR_DATABASE_ID", "progress", [
          Query.equal("userId", user.$id),
        ])
        setProgress(progressData.documents[0]?.progress || 0)

        // Fetch upcoming sessions
        const sessionsData = await databases.listDocuments("YOUR_DATABASE_ID", "sessions", [
          Query.equal("groupId", user.groupId),
          Query.greaterThan("date", new Date().toISOString()),
          Query.orderAsc("date"),
          Query.limit(5),
        ])
        setUpcomingSessions(sessionsData.documents)

        // Fetch recommended resources
        const resourcesData = await databases.listDocuments("YOUR_DATABASE_ID", "resources", [
          Query.equal("domain", user.domain),
          Query.orderDesc("$createdAt"),
          Query.limit(5),
        ])
        setRecommendedResources(resourcesData.documents)

        // Fetch quiz scores
        const scoresData = await databases.listDocuments("YOUR_DATABASE_ID", "quiz_scores", [
          Query.equal("userId", user.$id),
          Query.orderDesc("date"),
          Query.limit(10),
        ])
        setQuizScores(scoresData.documents)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up real-time listeners
    const unsubscribe = databases.subscribe(
      "YOUR_DATABASE_ID",
      ["sessions", "resources", "quiz_scores"],
      (event: RealtimeResponseEvent<any>) => {
        if (event.events.includes("databases.*.collections.sessions.documents.*")) {
          fetchDashboardData()
        }
        if (event.events.includes("databases.*.collections.resources.documents.*")) {
          fetchDashboardData()
        }
        if (event.events.includes("databases.*.collections.quiz_scores.documents.*")) {
          fetchDashboardData()
        }
      },
    )

    return () => {
      unsubscribe()
    }
  }, [user])

  const chartData = {
    labels: quizScores.map((score) => new Date(score.date).toLocaleDateString()).reverse(),
    datasets: [
      {
        label: "Quiz Scores",
        data: quizScores.map((score) => score.score).reverse(),
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
        text: "Recent Quiz Scores",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold inline-block text-indigo-600">{progress}% Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingSessions.map((session) => (
              <li key={session.$id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-medium">{session.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(session.date).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Resources</h2>
          <ul className="divide-y divide-gray-200">
            {recommendedResources.map((resource) => (
              <li key={resource.$id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-medium">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6 col-span-full">
          <h2 className="text-xl font-semibold mb-4">Quiz Performance</h2>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

