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

    public IsInit(): boolean {
        return this._client !== null;
    }

}