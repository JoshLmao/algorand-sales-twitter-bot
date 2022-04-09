import { TwitterClient } from "twitter-api-client";
import { NFTSale } from "./types";

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

    public IsInit(): boolean {
        return this._client !== null;
    }

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