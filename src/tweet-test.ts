import TweetFormatter from "./TweetFormatter";
import TwitterComms from "./TwitterComms";
import { ESaleLocation, NFTSale } from "./types";

const userCustomTweetFormat = require("../tweet-format.json");


function tweetTest() {
    // Parse env vars
    const apiKey: string = process.env.TWITTER_API_KEY ?? "";
    const apiKeyPrivate: string = process.env.TWITTER_API_KEY_SECRET ?? "";
    const accessToken: string = process.env.TWITTER_ACCESS_TOKEN ?? "";
    const accessTokenSecret: string = process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "";

    // Init TwitterComms class
    const _twitterComms = new TwitterComms(apiKey, apiKeyPrivate, accessToken, accessTokenSecret);
    if (!_twitterComms.IsInit()) {
        return;
    }

    const now = new Date();
    const _testSale: NFTSale = {
        receiver: "JOSHACIBJSSE2CA4VINXGAWAZ4KHA5S4Q2CLITWGUFD62R2JFAE56W6K5U",
        name: `test asset, please ignore (${ Math.round(now.getTime() / 1000) })`,
        assetId: 1234567,
        nftxUrl: "https://nftexplorer.app/asset/1234567",
        ualgos: 123000000,
        usdPrice: 250,
        saleLocation:  ESaleLocation.AB2,
        epochMs: now.getTime(),
    };

    // Try and parse, if not null, then return
    if (!userCustomTweetFormat.format) {
        console.error(`Format isn't configured. Set the 'format' value in tweet-format.json and try again`);
        return;
    }

    const formattedTweet = TweetFormatter.ParseCustomTweetFormat(userCustomTweetFormat.format, _testSale);
    
    _twitterComms.SendTweet(formattedTweet);
    console.log("Sent tweet.");
    console.warn("Check the twitter account that has been configured to tweet! You should probably delete it...");
    
}

(async () => {
    await tweetTest();
})();