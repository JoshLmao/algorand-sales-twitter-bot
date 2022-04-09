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
    //ToDo
    return null;
}