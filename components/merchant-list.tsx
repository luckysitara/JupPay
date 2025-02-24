"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Merchant {
  id: string
  owner: string
  preferred_token: string
}

export function MerchantList() {
  const [merchants, setMerchants] = useState<Merchant[]>([])

  useEffect(() => {
    async function fetchMerchants() {
      const { data, error } = await supabase.from("merchants").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching merchants:", error)
      } else {
        setMerchants(data)
      }
    }

    fetchMerchants()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Merchants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Preferred Token</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell>{merchant.owner}</TableCell>
                <TableCell>{merchant.preferred_token}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

