import { GetRecentCollectionSales, NFTxSaleFeedResponse } from "./GatherSales";
import TwitterComms from "./TwitterComms";
import { ESaleLocation, NFTSale } from "./types";
import TwitBotLogger from "./TwitBotLogger";
import TweetFormatter from "./TweetFormatter";
import { NFDAPI, NFDFullView } from "./nfd";

// Init .env and load
const path = require('path'); 
require('dotenv').config({ 
    path: path.join(__dirname, '../.env') 
});

const userCustomTweetFormat = require("../tweet-format.json");

// Current Twitter helper instance class
let _twitterComms: TwitterComms | null = null;
// Id of the collection on NFTx to monitor
const COLLECTION_ID: string | null = process.env.COLLECTION_ID ?? null;
const NFTX_API_AUTH: string | null = process.env.NFTX_API_AUTH ?? null;
// Minimum USD requirement of sale
const USD_MIN: number | null = process.env.MIN_USD_PRICE ? parseFloat(process.env.MIN_USD_PRICE) : null;
// Minumum algo (not uAlgo) requirement for sale
const ALGO_MIN: number | null = process.env.MIN_ALGO_PRICE ? parseFloat(process.env.MIN_ALGO_PRICE) : null;
// Request next token
let lastRequestNextToken: string | null = null;

/**
 * Sleeps execution for the given milliseconds
 * @param ms Amount in milliseconds to sleep for
 * @returns sleep 
 */
async function ThreadSleep(ms: number): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Does the current sale meet all of our requirements to tweet it out
 * @param sale The current sale
 * @returns true if all requirements are met
 */
function DoesSaleMeetRequirements(sale: NFTSale): boolean {
    const allRequirements: boolean[] = [];

    // Check sale meets minimum USD requirement if provided
    if (USD_MIN !== null && USD_MIN > 0) {
        allRequirements.push( sale.usdPrice >= USD_MIN );
    }

    // Check sale meets ALGO requiement if provided
    if (ALGO_MIN !== null && ALGO_MIN > 0) {
        const algo: number = sale.ualgos / 1000000;
        allRequirements.push( algo >= ALGO_MIN );
    }

    // Sale meets requirements if every requirement has been met (is true)
    if (allRequirements.length > 0) {
        return allRequirements.every(x => x === true);
    }
    // Default return to true as we have no requirements
    return true;
}

/**
 * Formats a NFT sale into a custom twitter format
 * @param sale The sale that is requiring to be formatted into a tweet
 * @returns A formatted string containing the tweet you wish to send
 */
function FormatSaleToTweet(sale: NFTSale, options?: {
    receiverNFDInfo?: NFDFullView,
}): string {
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
     * 
     * There is a range of premade ones stored in the TweetFormatter class which you can use.
     * Otherwise, use this space below to creator your own
     */

    // If user supplied a custom tweet format in the json file, lets use it
    if (userCustomTweetFormat && userCustomTweetFormat.format && userCustomTweetFormat.format.length > 0) {

        let formatted: string = userCustomTweetFormat.format;
        
        // Run through NFD formatting regardless of if we found one or not.
        // We replace the NFD specific formatting with blank if we didn't find an NFD
        formatted = TweetFormatter.ParseNFDFormatting(formatted, options?.receiverNFDInfo ?? null);

        // Try and parse, if not null, then return
        formatted = TweetFormatter.ParseCustomTweetFormat(formatted, sale);
        if (formatted !== null) {
            return formatted;
        }
    }

    /// Uncomment one of the following to use a preset
    /// Otherwise, comment out both and provide your own tweet
    //return TweetFormatter.BasicTweet(sale);
    return TweetFormatter.EmojiTweet(sale);
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
            
            // Skip if sale doesn't meet requirements
            if (!DoesSaleMeetRequirements(newSale)) {
                TwitBotLogger.info(`Ignoring sale '${newSale.name}' for ALGO/USD '${newSale.ualgos / 1000000}/${newSale.usdPrice}' as doesn't meet requirements '${ALGO_MIN}/${USD_MIN}'`);
                continue;
            }

            // Fetch if receiver has NFD, find first NFD with verified Twitter
            const owningNFDs: NFDFullView[] | undefined = await NFDAPI.FindNFD(newSale.receiver) ?? undefined;
            let verifiedTwitterNFD: NFDFullView | undefined = undefined;
            if (owningNFDs) {
                // Obtain first NFD with verified twitter or use first NFD
                verifiedTwitterNFD = NFDAPI.GetFirstVerifiedTwitter(owningNFDs) ?? owningNFDs[0];
            }

            // Format sale into tweet
            const formattedString: string = FormatSaleToTweet(newSale, {
                receiverNFDInfo: verifiedTwitterNFD ? verifiedTwitterNFD : undefined,
            });
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

    TwitBotLogger.info(`Bot initialized!${ USD_MIN !== null ? ` USD Minimum of $${USD_MIN}` : "" }${ALGO_MIN ? ` ALGO minimum of A${ALGO_MIN}` : "" }`);

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