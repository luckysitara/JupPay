"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Wallet } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  preferredToken: z.string().min(32).max(44),
})

export function MerchantRegistration() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, signTransaction } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredToken: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/merchants/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: publicKey.toBase58(),
          preferredToken: values.preferredToken,
        }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()

      toast({
        title: "Registration successful",
        description: `Merchant ID: ${data.merchantId}`,
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register merchant. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Merchant Registration
        </CardTitle>
        <CardDescription>Register as a merchant to start accepting payments in any token</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletMultiButton className="mb-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preferredToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the token address you want to receive" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || !publicKey}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

