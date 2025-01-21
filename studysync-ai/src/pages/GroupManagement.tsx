import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { Databases, Query, type RealtimeResponseEvent } from "appwrite";
import { client } from "../lib/appwrite";

const GroupManagement: React.FC = () => {
  const { user } = useAuth();
  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [futurePlans, setFuturePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const databases = new Databases(client);

    const fetchGroupData = async () => {
      try {
        // Fetch current group
        const groupData = await databases.listDocuments("YOUR_DATABASE_ID", "groups", [
          Query.equal("$id", user.groupId),
        ]);
        setCurrentGroup(groupData.documents[0]);

        // Fetch group members
        const membersData = await databases.listDocuments("YOUR_DATABASE_ID", "users", [
          Query.equal("groupId", user.groupId),
        ]);
        setGroupMembers(membersData.documents);

        // Fetch session history
        const historyData = await databases.listDocuments("YOUR_DATABASE_ID", "sessions", [
          Query.equal("groupId", user.groupId),
          Query.lessThan("date", new Date().toISOString()),
          Query.orderDesc("date"),
          Query.limit(10),
        ]);
        setSessionHistory(historyData.documents);

        // Fetch future plans
        const plansData = await databases.listDocuments("YOUR_DATABASE_ID", "sessions", [
          Query.equal("groupId", user.groupId),
          Query.greaterThan("date", new Date().toISOString()),
          Query.orderAsc("date"),
          Query.limit(5),
        ]);
        setFuturePlans(plansData.documents);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching group data:", error);
        setError("Failed to load group data. Please try again later.");
        setLoading(false);
      }
    };

    fetchGroupData();

    // Set up real-time listeners
    const unsubscribe = databases.subscribe(
      "YOUR_DATABASE_ID",
      ["groups", "users", "sessions"],
      (event: RealtimeResponseEvent<any>) => {
        if (event.events.includes("databases.*.collections.groups.documents.*")) {
          fetchGroupData();
        }
        if (event.events.includes("databases.*.collections.users.documents.*")) {
          fetchGroupData();
        }
        if (event.events.includes("databases.*.collections.sessions.documents.*")) {
          fetchGroupData();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleStayInGroup = async () => {
    try {
      const databases = new Databases(client);
      await databases.updateDocument("YOUR_DATABASE_ID", "users", user.$id, { stayInCurrentGroup: true });
    } catch (error) {
      console.error("Error updating user preference:", error);
      setError("Failed to update preference. Please try again.");
    }
  };

  const handleCreateSession = async () => {
    const title = prompt("Enter session title:");
    const date = prompt("Enter session date (YYYY-MM-DD):");
    const time = prompt("Enter session time (HH:MM):");

    if (title && date && time) {
      try {
        const databases = new Databases(client);
        await databases.createDocument("YOUR_DATABASE_ID", "sessions", "unique()", {
          groupId: user.groupId,
          title,
          date: `${date}T${time}:00.000Z`,
          createdBy: user.$id,
        });
      } catch (error) {
        console.error("Error creating session:", error);
        setError("Failed to create session. Please try again.");
      }
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
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Current Group</h2>
          {currentGroup ? (
            <div>
              <h3 className="text-xl font-medium mb-2">{currentGroup.name}</h3>
              <p className="text-gray-600 mb-4">Members: {groupMembers.length}</p>
              <button
                onClick={handleStayInGroup}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Stay in this group
              </button>
            </div>
          ) : (
            <p>You are not currently assigned to a group.</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
          <ul className="divide-y divide-gray-200">
            {groupMembers.map((member) => (
              <li key={member.$id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Session History</h2>
          <ul className="divide-y divide-gray-200">
            {sessionHistory.map((session) => (
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
          <h2 className="text-2xl font-semibold mb-4">Future Plans</h2>
          <ul className="divide-y divide-gray-200">
            {futurePlans.map((plan) => (
              <li key={plan.$id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-medium">{plan.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(plan.date).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCreateSession}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Session
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default GroupManagement;
