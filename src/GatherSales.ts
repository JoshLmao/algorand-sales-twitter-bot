import axios from "axios";
import { NFTSale } from "./types";
import TwitBotLogger from "./TwitBotLogger";

export type NFTxSaleFeedResponse = {
    nextToken: string;
    sales: NFTSale[];
};

/**
 * Gets all recent NFT sales for a collection, using it's id
 * @param collectionId The id of the collection to get sales for 
 * @param nextToken A nextToken provided from NFTx API. Can be empty
 * @param userAuth Current NFTx API authorization to access the endpoint
 * @returns Null if failed or an array of recent sales
 */
export async function GetRecentCollectionSales(collectionId: string, userAuth: string, nextToken: string | null): Promise<NFTxSaleFeedResponse | null> {
    /*
     *  For this, we're using a *rate limited* endpoint by NFT Explorer https://www.nftexplorer.app/
     *  which provides the last sales of the collection. The request requires authorization to ensure
     *  us calling the endpoint are the owners/have auth of the requesting collection
     */
    const baseUrl: string = "http://localhost:3050"; // `https://api.nftexplorer.app`;
    const endpoint: URL = new URL(`${baseUrl}/v1/collections/salesFeed/${collectionId}`);

    // Append nextToken to params if provided
    if (nextToken) {
        endpoint.searchParams.append("nextToken", nextToken);
    }
    
    const data: NFTxSaleFeedResponse | null = await MakeRequest(endpoint, userAuth);
    if (data !== null) {
        return data;
    }
    else {
        // Request failed or something happened
        return null;
    }
}


/**
 * Makes a GET request to the given url and returns the data
 * @param url URL to call a GET request on
 * @returns The response data of the request
 */
async function MakeRequest(url: URL, auth: string | null): Promise<any | null> {
    try {
        // Build and make response
        const response: any = await axios(url.href, {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
                'accept': '*/*',
                "authorization": auth ?? "",
            },
        })
        .catch( (error: any) => {
            if (error.response.status === 429) {
                TwitBotLogger.error(`Error Status Code 429: Request blocked as you are calling the API too quickly!`);
            }
            return null;
        });

        // If valid, get data and return
        if (response && response.status === 200) {
            return await response.data;
        }
        return null;
    }
    catch (e: any) {
        TwitBotLogger.error(`Unexpected error occured in MakeRequest(url = ${url.href}) | ${e}`);
    }
    return null;
}