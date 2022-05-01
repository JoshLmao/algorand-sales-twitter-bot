import { NFTSale } from "./types";

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

};