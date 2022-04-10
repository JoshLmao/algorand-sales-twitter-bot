import { TwitterClient } from "twitter-api-client";

export default class TwitterComms {

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
                this._client.tweets.statusesUpdate({ status: content });
            }
            catch (e: any) {
                console.error(`SendTweet error | ${e}`);
                return false;
            }
        }
        return false;
    }

}