export type NFTSale = {
    /**
     * The asaId of the NFT
     */
    assetId: number;
    /**
     * Name of the NFT
     */
    name: string;
    /**
     * Sale amount of the NFT in micro algos
     * Divide by `10^6` for algo amount.
     *  
     * For example: `ualgos / 1000000`
     */
    ualgos: number;
    /**
     * Algorand address of the receiver who bought the NFT
     */
    receiver: string;
    /**
     * The millisecond epoch time of when the sale occured
     */
    epochMs: number;
    /**
     * The NFT Explorer URL of the asset. Using this in your tweet will provide link metadata to display and embed the image automatically for you
     */
    nftxUrl: string;
    /**
     * USD price of the sale
     */
    usdPrice: number;
    /**
     * Location where the sale took place
     */
    saleLocation: "randgallery" | "algoxnft" | "ab2" | "algogems" | "dartroom" | "algodrop";
};