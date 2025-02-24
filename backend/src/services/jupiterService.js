import axios from "axios"

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6"
const JUPITER_SWAP_API = "https://public.jupiterapi.com"

export const getQuote = async (params) => {
  try {
    const response = await axios.get(`${JUPITER_QUOTE_API}/quote`, { params })
    return response
  } catch (error) {
    console.error("Error getting Jupiter quote:", error)
    throw error
  }
}

export const postSwap = async (data) => {
  try {
    const response = await axios.post(`${JUPITER_SWAP_API}/swap`, data)
    return response
  } catch (error) {
    console.error("Error posting Jupiter swap:", error)
    throw error
  }
}

