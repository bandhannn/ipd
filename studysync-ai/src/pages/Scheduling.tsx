import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { Databases, Query, type RealtimeResponseEvent } from "appwrite"
import { client } from "../lib/appwrite"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const Scheduling: React.FC = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const databases = new Databases(client)

    const fetchScheduleData = async () => {
      try {
        // Fetch user's group sessions
        const sessionsData = await databases.listDocuments("YOUR_DATABASE_ID", "sessions", [
          Query.equal("groupId", user.groupId),
        ])

        // Transform the sessions data into events for the calendar
        const calendarEvents = sessionsData.documents.map((session: any) => ({
          id: session.$id,
          title: session.title,
          start: new Date(session.date),
          end: new Date(new Date(session.date).getTime() + session.duration * 60000), // Assuming duration is in minutes
        }))

        setEvents(calendarEvents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching schedule data:", error)
        setError("Failed to load schedule data. Please try again later.")
        setLoading(false)
      }
    }

    fetchScheduleData()

    // Set up real-time listener
    const unsubscribe = databases.subscribe("YOUR_DATABASE_ID", ["sessions"], (event: RealtimeResponseEvent<any>) => {
      if (event.events.includes("databases.*.collections.sessions.documents.*")) {
        fetchScheduleData()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user])

  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("Enter a title for your new session:")
    if (title) {
      const newEvent = { title, start, end }
      setEvents([...events, newEvent])

      try {
        const databases = new Databases(client)
        await databases.createDocument("YOUR_DATABASE_ID", "sessions", "unique()", {
          title,
          date: start.toISOString(),
          duration: (end.getTime() - start.getTime()) / 60000, // Duration in minutes
          groupId: user.groupId,
          createdBy: user.$id,
        })
      } catch (error) {
        console.error("Error creating new session:", error)
        setError("Failed to create new session. Please try again.")
      }
    }
  }

  const handleSelectEvent = (event: any) => {
    const action = window.confirm(`Do you want to delete the session "${event.title}"?`)
    if (action) {
      try {
        const databases = new Databases(client)
        databases.deleteDocument("YOUR_DATABASE_ID", "sessions", event.id)
        // The real-time listener will update the UI
      } catch (error) {
        console.error("Error deleting session:", error)
        setError("Failed to delete session. Please try again.")
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
      <div className="h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">Group Schedule</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 200px)" }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </Layout>
  )
}

export default Scheduling

