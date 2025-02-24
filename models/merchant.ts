import mongoose from "mongoose"

const merchantSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    preferredToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Merchant = mongoose.models.Merchant || mongoose.model("Merchant", merchantSchema)

