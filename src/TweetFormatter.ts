import { DateTime } from "luxon";
import { NFDFullView } from "./nfd";
import { ESaleLocation, NFTSale } from "./types";

export default class TweetFormatter {

    public static BasicTweet(sale: NFTSale): string {
        const algoAmount: number = sale.ualgos / Math.pow(10, 6);
        const shortenedBuyer: string = this.ShortenBuyerAddress(sale.receiver, 4);
        return `${sale.name} just sold for ${algoAmount} to buyer '${shortenedBuyer}'\n\n${sale.nftxUrl}`;
    }

    public static EmojiTweet(sale: NFTSale): string {
        const algoAmount = sale.ualgos / 1000000;
        return `🖼 ${sale.name}\n💵 Ⱥ${algoAmount}\n💰 $${sale.usdPrice}\n${sale.nftxUrl}`;
    }

    /**
     * Shortens an Algorand address to the specific `charCount` amount at beginning and end.
     * For example, if 4, then will return ABCD...WXYZ
     * @param address The Algorand address to shorten
     * @param charCount Amount of characters to show at beginning and end
     * @param [separator] Optional separator string to use inbetween
     * @returns The provided `address` but shortened to the `charCount` and with the `separator` inbetween
     */
    public static ShortenBuyerAddress(address: string, charCount: number, separator: string = "...") {
        return address.substring(0, charCount) + separator + address.substring(address.length - charCount);
    }


    /**
     * Converts an ESaleLocation enum to a human readable string
     * @param location 
     * @returns sale location readable 
     */
    public static ConvertSaleLocationReadable(location: ESaleLocation): string {
        switch(location) {
            case ESaleLocation.RandGallery:
                return "RandGallery";
            case ESaleLocation.ALGOxNFT:
                return "ALGOxNFT";
            case ESaleLocation.AB2:
                return "AB2";
            case ESaleLocation.AlgoGems:
                return "AlgoGems"
            case ESaleLocation.AlgoDrop:
                return "AlgoDrop"
            case ESaleLocation.Dartroom:
                return "Dartroom";
            default:
                return "Unknown Location";
        }
    }


    /**
     * Parses the custom tweet format that can be specified. Must be a string with the following variables surrounded by curly braces
     * For example: `NFT {name}`
     * @param tweetFormat 
     * @returns custom tweet format 
     */
    public static ParseCustomTweetFormat(tweetFormat: string, sale: NFTSale): string {
        const replaceMap = new Map<string, any>([
            [ "{name}", sale.name ],
            [ "{nftxUrl}", sale.nftxUrl ],
            [ "{assetId}", sale.assetId ],
            [ "{usdPrice}", sale.usdPrice ],
            // Sale location converted to display readable string
            [ "{location}", TweetFormatter.ConvertSaleLocationReadable(sale.saleLocation) ],
            // Normal ualgos or regular Algos
            [ "{ualgos}", sale.ualgos ],
            [ "{algos}", sale.ualgos / 1000000 ],
            // Full receiver address or a shortened version
            [ "{receiver}", sale.receiver ],
            [ "{shortReceiver}", TweetFormatter.ShortenBuyerAddress(sale.receiver, 4) ],
            // Regular epochMs or formatted string
            [ "{epochMs}", sale.epochMs ],
            [ "{dateShort}", DateTime.fromMillis(sale.epochMs).toLocaleString(DateTime.DATETIME_SHORT) ],
        ]);
        
        // Store original, iterate through replace map and replace any keys with values
        let original: string = tweetFormat;
        for (const [ key, value ] of replaceMap) {
            if (original.includes(key)) {
                original = original.replace(key, value);
            }
        }
        // Return modified
        return original;
    }


    /**
     * Parses the given `nfdInfo` into the given `tweetFormat`
     * @param tweetFormat 
     * @param nfdInfo 
     * @returns nfdformatting 
     */
    public static ParseNFDFormatting(tweetFormat: string, nfdInfo: NFDFullView | null): string {
        const replaceMap: Map<string, any> = new Map([
            // Replace receiver with the .algo NFD name
            [ "{receiver}", nfdInfo?.name ?? null ],
            [ "{shortReceiver}", nfdInfo?.name ?? null ],
            [ "{nfdTwitterHandle}", nfdInfo?.properties?.verified?.twitter ?? "" ]
        ]);
        
        let original: string = tweetFormat;
        for (const [ key, value ] of replaceMap) {
            // If not null, replace value
            if (original.includes(key) && value !== null) {
                original = original.replace(key, value);
            }
        }
        return original;
    }
};