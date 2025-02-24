"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CreditCard } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  merchantId: z.string().uuid(),
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number),
  inputToken: z.string().min(32).max(44),
})

export function PaymentForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, signTransaction } = useWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantId: "",
      amount: "",
      inputToken: "",
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
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          customer: publicKey.toBase58(),
        }),
      })

      if (!response.ok) {
        throw new Error("Payment creation failed")
      }

      const data = await response.json()

      toast({
        title: "Payment created successfully",
        description: `Payment ID: ${data.paymentId}`,
      })

      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create payment. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Create Payment
        </CardTitle>
        <CardDescription>Create a new payment for a merchant</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletMultiButton className="mb-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="merchantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the merchant's ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the payment amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the input token address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || !publicKey}>
              {isLoading ? "Creating Payment..." : "Create Payment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

