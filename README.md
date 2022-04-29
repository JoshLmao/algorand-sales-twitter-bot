# Algorand Sales Twitter Bot 🐦

A bot to get the latest sales of a creator address and post them to Twitter. Nicely written and open sourced by [@JoshLmao](https://twitter.com/joshlmao).

⚠ Currently a WORK IN PROGRESS

# License

This repository specifically has the ["No License" license](https://choosealicense.com/no-permission/). This forbids any for-profit use and may only be explicitly used for non-profit or free means.

# Setup

- Make twitter account for bot. This bot will create the developer app and tweet out
- Go to developer portal, create Developer App **on Bot Account**
- Setting, User authentification settings, click Edit
    - Check the boxes to enable Oauth 2.0, 1.0a
    - **Type of app**: Automated app or bot
    - **App permissions**: Read and write
    - **Callback**: `https://localhost:3000`
    - **Website**: Your website
- Keys and tokens, Access Token and Secret, click Regenate to get `accessToken` and `accessTokenSecret`
- Save API keys and access keys. Put them in .env
- You also need to apply for "Elevated" API access
    - Select "Products" on the left panel and select "Twitter API v2"
    - Select "Elevated" at the top. Click the prompt and provide extra information needed

Once done, you will have obtained the relevant Twitter API variables needed. The last thing you need is an `authorization` token from NFTx. Obtain one by going to https://api.nftexplorer.app

Set the variables in the `.env` file to your obtained values.

# Run

- `npm install` to install all required packages
- `tsc` to build Typescript to Javascript
- `node ./build/monitor.js` to run the monitor script