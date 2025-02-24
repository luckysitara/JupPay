import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import crypto from "crypto"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, created_at, last_used_at")
      .eq("merchant_id", params.id)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name } = body

    const key = crypto.randomBytes(32).toString("hex")

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        merchant_id: params.id,
        key,
        name,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ message: "API key created successfully", apiKey: data[0] })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const keyId = searchParams.get("keyId")

    const { error } = await supabase.from("api_keys").delete().eq("id", keyId).eq("merchant_id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "API key deleted successfully" })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

