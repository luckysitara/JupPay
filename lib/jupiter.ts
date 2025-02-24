import axios from "axios"

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6"
const JUPITER_SWAP_API = "https://public.jupiterapi.com"

interface QuoteParams {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps: number
}

interface SwapParams {
  route: any
  userPublicKey: string
}

export async function getQuote(params: QuoteParams) {
  try {
    const response = await axios.get(`${JUPITER_QUOTE_API}/quote`, {
      params: {
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        amount: params.amount,
        slippageBps: params.slippageBps,
      },
    })
    return response
  } catch (error) {
    console.error("Error getting Jupiter quote:", error)
    throw error
  }
}

export async function postSwap(params: SwapParams) {
  try {
    const response = await axios.post(`${JUPITER_SWAP_API}/swap`, {
      route: params.route,
      userPublicKey: params.userPublicKey,
    })
    return response
  } catch (error) {
    console.error("Error posting Jupiter swap:", error)
    throw error
  }
}

