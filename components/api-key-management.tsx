"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface ApiKey {
  id: string
  name: string
  created_at: string
  last_used_at: string | null
}

export function ApiKeyManagement({ merchantId }: { merchantId: string }) {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  async function fetchApiKeys() {
    const response = await fetch(`/api/merchants/${merchantId}/api-keys`)
    const data = await response.json()
    setApiKeys(data)
  }

  async function createApiKey() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/merchants/${merchantId}/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (!response.ok) throw new Error("Failed to create API key")

      const data = await response.json()
      toast({ title: "API key created successfully", description: `Key: ${data.apiKey.key}` })
      setNewKeyName("")
      fetchApiKeys()
    } catch (error) {
      toast({ title: "Error creating API key", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteApiKey(keyId: string) {
    try {
      const response = await fetch(`/api/merchants/${merchantId}/api-keys?keyId=${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete API key")

      toast({ title: "API key deleted successfully" })
      fetchApiKeys()
    } catch (error) {
      toast({ title: "Error deleting API key", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="New API key name" />
            <Button onClick={createApiKey} disabled={isLoading || !newKeyName}>
              {isLoading ? "Creating..." : "Create API Key"}
            </Button>
          </div>
          <ul className="space-y-2">
            {apiKeys.map((key) => (
              <li key={key.id} className="flex justify-between items-center">
                <span>{key.name}</span>
                <Button variant="destructive" onClick={() => deleteApiKey(key.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

