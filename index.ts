import { DFUSE_API_KEY, runMain, DFUSE_API_NETWORK } from "./config"
import { createDfuseClient } from "@dfuse/client"
import { asset } from "eos-common"

async function main() {
  const client = createDfuseClient({ apiKey: DFUSE_API_KEY, network: DFUSE_API_NETWORK })

  const searchTransactions = `query ($limit: Int64!) {
    searchTransactionsBackward(query: "data.from:thisisbancor receiver:thisisbancor", limit: $limit) {
      results {
        block { num }
        trace { id matchingActions { json } }
      }
    }
  }`

  try {
    const response = await client.graphql(searchTransactions, {
      variables: { limit: 10  }
    })

    const results = response.data.searchTransactionsBackward.results || []

    results.forEach((result: any) => {
      for (const { json } of result.trace.matchingActions ) {
        const { from, to, quantity, memo } = json;
        console.log(result.trace.id, asset( quantity ).to_string());
      }
    })
  } catch (error) {
    console.log("An error occurred", error)
  }

  client.release()
}

runMain(main)