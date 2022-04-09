import { format } from "path";
import { GetRecentCollectionSales } from "./GatherSales";
import TwitterComms from "./TwitterComms";
import { NFTSale } from "./types";

// Init .env and load
const path = require('path'); 
require('dotenv').config({ 
    path: path.join(__dirname, '../.env') 
});

let _twitterComms: TwitterComms | null = null;
// Current timeout thread
let runningTimeout: any | null = null;
// The last sale that got tweeted out
let lastNotifiedSale: NFTSale | null = null;
// Id of the collection on NFTx to monitor
const COLLECTION_ID: string | null = process.env.COLLECTION_ID ?? null;

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

    const algoAmount: number = sale.microAlgos / Math.pow(10, 6);
    return `NFT ${sale.name} just sold for ${algoAmount} to buyer '${sale.receiver}'`;
}

// Main check function. Call once every X duration to perform the check
async function check() {

    let allRecentSales: NFTSale[] | null = null;
    if (COLLECTION_ID) {
        allRecentSales = await GetRecentCollectionSales(COLLECTION_ID);
    }
    
    if (allRecentSales && allRecentSales.length > 0) {
        const hasNewSales: boolean = lastNotifiedSale !== allRecentSales[0];
        if (hasNewSales) {
            
            // Determine all sales that are new and require to be tweeted out
            let newSales: NFTSale[] = [];
            if (lastNotifiedSale) {
                for (const sale of allRecentSales) {
                    if (sale.epochMs > lastNotifiedSale.epochMs) {
                        newSales.push(sale);
                    }
                }
            }
            else {
                // no prior notified sale, set all
                newSales = allRecentSales;
            }

            // Iterate over each new sale and tweet out
            for (const newSale of newSales) {
                const formattedString: string = FormatSaleToTweet(newSale);
                if (_twitterComms === null) {
                    console.error(`Twitter is not setup!`);
                }
                else {
                    _twitterComms.SendTweet(formattedString);
                }
            }

            // Update last tweeted out sale
            lastNotifiedSale = newSales[0];
        }
    }
    
}

// Main entry point
function main() {
    // Parse env vars
    const apiKey: string = process.env.TWITTER_API_KEY ?? "";
    const apiKeyPrivate: string = process.env.TWITTER_API_KET_SECRET ?? "";
    const accessToken: string = process.env.TWITTER_ACCESS_TOKEN ?? "";
    const accessTokenSecret: string = process.env.TWITTER_ACCESS_TOKEN_PRIVATE ?? "";

    // Init TwitterComms class
    _twitterComms = new TwitterComms(apiKey, apiKeyPrivate, accessToken, accessTokenSecret);
    if (!_twitterComms.IsInit()) {
        return;
    }

    // Start thread to monitor sales every duration
    const envVarMinutes: number = process.env.CHECK_MINUTES ? parseInt(process.env.CHECK_MINUTES) : 1;
    const ms: number = envVarMinutes * 60 * 1000;
    runningTimeout = setTimeout(async () => {
        await check();
    }, ms);
}

(() => {
    main();
});