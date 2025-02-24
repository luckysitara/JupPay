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

const Merchant = mongoose.model("Merchant", merchantSchema)

export default Merchant

