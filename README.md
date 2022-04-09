# Algorand Sales Twitter Bot 🐦

A bot to get the latest sales of a creator address and post them to Twitter. Nicely written and open sourced by [@JoshLmao](https://twitter.com/joshlmao).

# License

This repository specifically has the ["No License" license](https://choosealicense.com/no-permission/). This forbids any for-profit use and may only be explicitly used for non-profit or free means.

# Setup

- Make twitter account for bot. This bot will create the developer app and tweet out
- Go to developer portal, create Developer App **on Bot Account**
- Setting, User authentification settings, click Edit
    - Enable Oauth 2.0, 1.0a
    - Type of app: Automated app or bot
    - App permissions: Read and write
    - Callback: `https://localhost:3000`
    - Website: Your website
- Keys and tokens, Access Token and Secret, click Regenate to get `accessToken` and `accessTokenSecret`
- Save API keys and access keys. Put them in .env

# Run

- `npm install` to install all required packages
- `tsc` to build Typescript to Javascript
- `node ./build/monitor.js` to run the monitor script