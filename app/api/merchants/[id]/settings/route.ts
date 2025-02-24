import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase.from("merchants").select("settings").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json(data.settings)
  } catch (error) {
    console.error("Error fetching merchant settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { settings } = body

    const { data, error } = await supabase.from("merchants").update({ settings }).eq("id", params.id).select()

    if (error) throw error

    return NextResponse.json({ message: "Settings updated successfully", merchant: data[0] })
  } catch (error) {
    console.error("Error updating merchant settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

