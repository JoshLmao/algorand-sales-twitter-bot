import axios from "axios";
import { markAsUntransferable } from "worker_threads";
import { NFTSale } from "./types";


/**
 * Gets all recent NFT sales from the provided creator addresses
 * @param creatorAddresses 
 * @returns Null if failed or an array of recent sales 
 */
export async function GetRecentSales(creatorAddresses: string[]): Promise<NFTSale[] | null> {
    // ToDo
    return null;
}



/**
 * Gets all recent NFT sales for a collection, using it's id
 * @param collectionId The id of the collection to get sales for
 * @returns Null if failed or an array of recent sales
 */
export async function GetRecentCollectionSales(collectionId: string): Promise<NFTSale[] | null> {
    /*
     *  For this, we're using a free *rate limited* endpoint by NFT Explorer https://www.nftexplorer.app/
     *  which provides the last X sales of the collection. The request requires authorization to ensure
     *  us calling the endpoint are the owners/have auth of the requesting collection
     */
    const endpoint: URL = new URL(`https://api.nftexplorer.app/v1/sales/${collectionId}`);
    
    const data: any | null = MakeRequest(endpoint);
    if (data !== null && Array.isArray(data)) {
        const sales: NFTSale[] = data as NFTSale[];
        return sales;
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
async function MakeRequest(url: URL): Promise<any | null> {
    try {
        // Build and make response
        const response: any = await axios(url.href, {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
                'accept': '*/*',
            },
        });

        // If valid, get data and return
        if (response && response.status === 200) {
            return await response.data;
        }
    }
    catch (e: any) {
        console.error(`Unexpected error occured in MakeRequest(url = ${url.href}) | ${e}`);
    }
    return null;
}