# Algorand Sales Twitter Bot 🐦

A bot to get the latest sales of a creator address and post them to Twitter. Nicely written and open sourced by [@JoshLmao](https://twitter.com/joshlmao).

# License

This repository specifically has the ["No License" license](https://choosealicense.com/no-permission/). This forbids any for-profit use and may only be explicitly used for non-profit or free means.

# Support

If you found this useful, please consider supporting [NFT Explorer](https://www.nftexplorer.app/) to help pay for running costs as this would not be possible without their API

NFTx donate address: [`Z6EKYUZTFHFVWUS7EYJC5PVLNIQD7OZRNWTSBDFAAZA3FF2IZDSWLUJ33U`](https://algoexplorer.io/address/Z6EKYUZTFHFVWUS7EYJC5PVLNIQD7OZRNWTSBDFAAZA3FF2IZDSWLUJ33U)

# Setup

- Make twitter account for bot. This bot will create the developer app and tweet out
- Go to the [Twitter developer portal](https://developer.twitter.com/), create Developer App **on Bot Account**
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

Once done, you will have obtained the relevant Twitter API variables needed. The last thing you need is an `authorization` token from NFTx.

## Creating a Droplet *(Optional)*

You'll want somewhere to run this, I advice this step if you know what you're doing, otherwise skip to [how to run the bot](#run) 

I suggest using Digital Ocean. Sign up, create a Droplet of Ubuntu, Basic, Regular with SSD, choose location, configure SSH keys, Create droplet

After initializing, open the console of the droplet, run the following commands
- `git clone https://github.com/JoshLmao/algorand-sales-twitter-bot.git ./twitter-bot`
- `cd ./twitter-bot`
- `sudo apt update`
- `sudo apt install nodejs`
- `sudo apt install npm`
- `sudo apt install node-typescript`

# Update the `.env`

Make sure you configure the .env with your obtained values

- Linux
    - `nano ./.env` and enter each variable.
    - `Ctrl + X` to exit
    - `Y` to confirm save
    - `Enter` to confirm the file
- Windows
    - Edit the file in a text editor. Right click an open in Notepad. 
    - Set the variables, save the file.

# Run

Before running, make sure to do the [Update the `.env`](#update-the-env) steps

- `npm install` to install all required packages. Should be run before any attempt to run
- `npm start` to build and run the script with the current `.env` configuration

# Updating

If you wish to update, do the following

- `git pull` to get the latest changes from the repo
    - Note: if there are merge conflicts, you can do `git stash` to save your changes, allowing you to do `git pull` and then run `git stash pop` to apply it again
    - *Warning:* You might have merge conflicts when running `git stash pop`. I suggest either managing the merge yourself or running `git reset --hard origin/main` and redoing your changes

Once done, you can do the same command [in run](#run) to run the bot

# Customization

You can customize the output tweet of the bot by changing the Typescript function [`FormatSaleToTweet()`](./src/monitor.ts#L29). This step requires some coding knowledge