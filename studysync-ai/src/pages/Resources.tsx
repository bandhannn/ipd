import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { Databases, Query, Storage, type RealtimeResponseEvent } from "appwrite"
import { client } from "../lib/appwrite"

const Resources: React.FC = () => {
  const { user } = useAuth()
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const databases = new Databases(client)

    const fetchResources = async () => {
      try {
        const resourcesData = await databases.listDocuments("YOUR_DATABASE_ID", "resources", [
          Query.equal("domain", user.domain),
          Query.orderDesc("$createdAt"),
        ])
        setResources(resourcesData.documents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError("Failed to load resources. Please try again later.")
        setLoading(false)
      }
    }

    fetchResources()

    // Set up real-time listener
    const unsubscribe = databases.subscribe("YOUR_DATABASE_ID", ["resources"], (event: RealtimeResponseEvent<any>) => {
      if (event.events.includes("databases.*.collections.resources.documents.*")) {
        fetchResources()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const storage = new Storage(client)
      const fileUpload = await storage.createFile("YOUR_BUCKET_ID", "unique()", file)

      const databases = new Databases(client)
      await databases.createDocument("YOUR_DATABASE_ID", "resources", "unique()", {
        title: file.name,
        fileId: fileUpload.$id,
        domain: user.domain,
        userId: user.$id,
      })

      setUploadingFile(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Failed to upload file. Please try again.")
      setUploadingFile(false)
    }
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const storage = new Storage(client)
      const fileUrl = storage.getFileDownload("YOUR_BUCKET_ID", fileId)

      const link = document.createElement("a")
      link.href = fileUrl.href
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      setError("Failed to download file. Please try again.")
    }
  }

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h2 className="text-2xl font-semibold mb-4">Resources</h2>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Upload New Resource</h3>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploadingFile}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {uploadingFile && <p className="mt-2 text-sm text-gray-600">Uploading...</p>}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Available Resources</h3>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          />
          <ul className="divide-y divide-gray-200">
            {filteredResources.map((resource) => (
              <li key={resource.$id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on: {new Date(resource.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDownload(resource.fileId, resource.title)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Resources

