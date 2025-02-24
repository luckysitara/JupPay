"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Payment {
  id: string
  merchant_id: string
  customer: string
  amount: number
  input_token: string
  output_token: string
  status: string
}

export function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    async function fetchPayments() {
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching payments:", error)
      } else {
        setPayments(data)
      }
    }

    fetchPayments()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

