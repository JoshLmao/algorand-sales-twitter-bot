
export type NFTSale = {
    /**
     * The asaId of the NFT
     */
    asaId: number;
    /**
     * Name of the NFT
     */
    name: string;
    /**
     * Sale amount of the NFT in micro algos
     * Divide by 10^6 for algo amount 
     */
    microAlgos: number;
    /**
     * Algorand address of the receiver
     */
    receiver: string;
    /**
     * The millisecond epoch time of when the sale occured
     */
    epochMs: number;
};