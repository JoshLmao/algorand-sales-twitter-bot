import { GetRecentCollectionSales, NFTxSaleFeedResponse } from "./GatherSales";
import TwitterComms from "./TwitterComms";
import { NFTSale } from "./types";
import TwitBotLogger from "./TwitBotLogger";

// Init .env and load
const path = require('path'); 
require('dotenv').config({ 
    path: path.join(__dirname, '../.env') 
});

// Current Twitter helper instance class
let _twitterComms: TwitterComms | null = null;
// Id of the collection on NFTx to monitor
const COLLECTION_ID: string | null = process.env.COLLECTION_ID ?? null;
const NFTX_API_AUTH: string | null = process.env.NFTX_API_AUTH ?? null;
// Request next token
let lastRequestNextToken: string | null = null;

async function ThreadSleep(ms: number): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a NFT sale into a custom twitter format
 * @param sale The sale that is requiring to be formatted into a tweet
 * @returns A formatted string containing the tweet you wish to send
 */
function FormatSaleToTweet(sale: NFTSale): string {
    /*
     * Here is where you can customize the bot's tweet into any format you like.
     * The string can contain emojis if you wish to use them.    
     * You can also do a new line by using \n in the string. 
     * For example:
     * 
     * `This is an example\nof a tweet on\na new line`
     * 
     * ...would tweet like...
     * 
     * This is an example
     * of a tweet on
     * a new line
     */

    const algoAmount: number = sale.ualgos / Math.pow(10, 6);
    const buyerAddrShowChars: number = 4;
    const shortenedBuyer: string = sale.receiver.substring(0, buyerAddrShowChars) + "..." + sale.receiver.substring(sale.receiver.length - buyerAddrShowChars);
    return `${sale.name} just sold for ${algoAmount} to buyer '${shortenedBuyer}'\n\n${sale.nftxUrl}`;
}

// Main check function. Call once every X duration to perform the check
async function check() {

    // Make request to get new sales
    let allRecentSales: NFTSale[] | null = null;
    let nextToken: string | null = null;
    if (COLLECTION_ID && NFTX_API_AUTH) {
        const resp: NFTxSaleFeedResponse | null  = await GetRecentCollectionSales(COLLECTION_ID, NFTX_API_AUTH, lastRequestNextToken);
        if (resp) {
            allRecentSales = resp.sales;
            nextToken = resp.nextToken;
        }
    }
    
    // If have sales and has more than 0 and lastRequestNextToken is valid
    // Dont tweet a sale when we don't have a previous nextToken as it is just last sale
    if (allRecentSales && allRecentSales.length > 0 && lastRequestNextToken) {
        // Determine all sales that are new and require to be tweeted out
        // Iterate over each new sale and tweet out
        for (const newSale of allRecentSales) {
            const formattedString: string = FormatSaleToTweet(newSale);
            if (_twitterComms === null) {
                TwitBotLogger.error(`Twitter is not setup!`);
            }
            else {
                TwitBotLogger.info(`Sending tweet | Sale ${newSale.name} for ${newSale.ualgos / 1000000}A`);
                _twitterComms.SendTweet(formattedString);
            }

            // Sleep a duration before tweeting next if more than one sale occured
            if (allRecentSales.length > 1) {
                const sleepMs: number = 1000;
                await ThreadSleep(sleepMs);
            }
        }
    }
    
    // Update and store the next nextToken if provided
    if (nextToken) {
        lastRequestNextToken = nextToken;
    }
}

// Main entry point
async function main() {
    // Parse env vars
    const apiKey: string = process.env.TWITTER_API_KEY ?? "";
    const apiKeyPrivate: string = process.env.TWITTER_API_KEY_SECRET ?? "";
    const accessToken: string = process.env.TWITTER_ACCESS_TOKEN ?? "";
    const accessTokenSecret: string = process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "";

    if (COLLECTION_ID && NFTX_API_AUTH) {
        TwitBotLogger.info(`Configured to track '${COLLECTION_ID}' sales from NFTx API`);
    }
    else {
        TwitBotLogger.error(`No COLLECTION_ID or NFTX_API_AUTH provided! Make sure`);
        return;
    }

    // Init TwitterComms class
    _twitterComms = new TwitterComms(apiKey, apiKeyPrivate, accessToken, accessTokenSecret);
    if (!_twitterComms.IsInit()) {
        return;
    }

    // Start thread to monitor sales every duration
    const envVarMinutes: number = process.env.CHECK_SECONDS ? parseInt(process.env.CHECK_SECONDS) : 60;
    const ms: number = envVarMinutes * 1000;
    while (true) {
        // Perform a check
        TwitBotLogger.info("Awoken, performing check...");
        await check();

        // Sleep for specified amount of time
        TwitBotLogger.info(`Sleeping for ${ms}ms`);
        await ThreadSleep(ms);
    }

}

(async () => {
    await main();
})();