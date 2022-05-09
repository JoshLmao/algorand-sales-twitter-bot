import { TwitterClient } from "twitter-api-client";
import TwitBotLogger from "./TwitBotLogger";

export default class TwitterComms {

    // Current instance of TwitterClient from twiter-api-client
    private _client: TwitterClient | null = null;

    constructor(apiKey: string, apiKeySecret: string, accessToken: string, accessTokenPrivate: string) {
        this._client = new TwitterClient({
            apiKey: apiKey,
            apiSecret: apiKeySecret,
            accessToken: accessToken,
            accessTokenSecret: accessTokenPrivate,
        });
    }

    /**
     * Determines whether the Twitter communication is valid and open, initialized
     * @returns true if has been initialized
     */
    public IsInit(): boolean {
        return this._client !== null;
    }


    /**
     * Sends a tweet with the provided content to the authed user
     * @param content 
     * @returns true if tweet successful
     */
    public SendTweet(content: string): boolean {
        if (this._client) {
            try {
                this._client.tweets.statusesUpdate({ status: content })
                    .catch((e) => {
                        TwitBotLogger.error(`Unexpected error with TwitterComms | ${e.statusCode}  ${e.data}`);
                    });
                return true;
            }
            catch (e) {
                TwitBotLogger.error(`SendTweet error | ${e}`);
                return false;
            }
        }
        return false;
    }

}