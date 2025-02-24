"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const settingsSchema = z.object({
  notificationEmail: z.string().email().optional(),
  webhookUrl: z.string().url().optional(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function MerchantSettings({ merchantId }: { merchantId: string }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    async function fetchSettings() {
      const response = await fetch(`/api/merchants/${merchantId}/settings`)
      const data = await response.json()
      form.reset(data)
    }
    fetchSettings()
  }, [merchantId, form])

  async function onSubmit(values: SettingsFormValues) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/merchants/${merchantId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      })

      if (!response.ok) throw new Error("Failed to update settings")

      toast({ title: "Settings updated successfully" })
    } catch (error) {
      toast({ title: "Error updating settings", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

