import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { Databases, Query, RealtimeResponseEvent } from "appwrite";
import { client } from "../lib/appwrite";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface Note {
  $id: string;
  content: string;
  userId: string;
  groupId: string;
  createdAt: string;
}

const CollaborativeNotes: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const databases = new Databases(client);

    const fetchNotes = async () => {
      try {
        const notesData = await databases.listDocuments("YOUR_DATABASE_ID", "collaborative_notes", [
          Query.equal("groupId", user.groupId),
          Query.orderDesc("$createdAt"),
        ]);
        setNotes(notesData.documents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
        setLoading(false);
      }
    };

    fetchNotes();

    const unsubscribe = databases.subscribe<RealtimeResponseEvent<Note>>(
      "YOUR_DATABASE_ID",
      ["collections.collaborative_notes.documents"],
      (event) => {
        if (event.events.includes("databases.*.collections.collaborative_notes.documents.*")) {
          fetchNotes();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleAddNote = async () => {
    if (newNote.trim() === "") return;

    try {
      const databases = new Databases(client);
      await databases.createDocument("YOUR_DATABASE_ID", "collaborative_notes", "unique()", {
        content: newNote,
        userId: user.$id,
        groupId: user.groupId,
        createdAt: new Date().toISOString(),
      });
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const databases = new Databases(client);
      await databases.deleteDocument("YOUR_DATABASE_ID", "collaborative_notes", noteId);
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Collaborative Notes</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
            ></textarea>
            <button
              onClick={handleAddNote}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Note
            </button>
          </div>
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.$id} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{note.content}</p>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <span>By: {note.userId === user.$id ? "You" : "Group member"}</span>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                {note.userId === user.$id && (
                  <button
                    onClick={() => handleDeleteNote(note.$id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborativeNotes;
