import TwitterComms from "./TwitterComms";

// Init .env and load
const path = require('path'); 
require('dotenv').config({ 
    path: path.join(__dirname, '../.env') 
});

// Main entry point
function main() {
    // Parse env vars
    const apiKey: string = process.env.TWITTER_API_KEY ?? "";
    const apiKeyPrivate: string = process.env.TWITTER_API_KET_SECRET ?? "";
    const accessToken: string = process.env.TWITTER_ACCESS_TOKEN ?? "";
    const accessTokenSecret: string = process.env.TWITTER_ACCESS_TOKEN_PRIVATE ?? "";

    // Init TwitterComms class
    const twitter = new TwitterComms(apiKey, apiKeyPrivate, accessToken, accessTokenSecret);
    if (!twitter.IsInit()) {
        return;
    }

}

(() => {
    main();
});