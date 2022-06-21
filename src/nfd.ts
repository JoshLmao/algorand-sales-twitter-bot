import axios from "axios";

// Note: this isn't all properties of the full view, just the ones we care about :P (and some extra)
export type NFDFullView = {
    // NFD .algo name
    name: string;
    // Owning Algorand address
    owner: string;
    properties: {
        userDefined: any;
        verified: {
            avatar: string;
            twitter: string;
            discord: string;
        };
    };
    // Array of crypto address algorand, i.e, set deposit address by NFD user
    caAlgo: string[];
};

export class NFDAPI {

    /**
     * Mainnet API url of NFD
     */
    private static readonly MAINNET_URL: string = "https://api.nf.domains";


    /**
     * Reverse looks up an Algorand address to determine if they own a .algo NFD
     * @param address 
     * @returns nfd 
     */
    public static async FindNFD(address: string): Promise<NFDFullView[] | null> {
        const url = new URL(this.MAINNET_URL + "/nfd/address");
        url.searchParams.append("view", "full");
        url.searchParams.append("address", address);

        const resp: NFDFullView[] = await this.SendRequest(url);
        if (resp && resp.length > 0) {
            return resp;
        }
        return null;
    }


    /**
     * Gets the first NFD with a linked and verified twitter account
     * @param nfds Array of NFDs
     * @returns The first NFD with a verified twitter profile
     */
    public static GetFirstVerifiedTwitter(nfds: NFDFullView[]): NFDFullView | null {
        for (const nfd of nfds) {
            if (nfd.properties?.verified?.twitter) {
                return nfd;
            }
        }
        return null;
    }

    /**
     * Sends a web request
     * @param url 
     * @returns request 
     */
    private static async SendRequest(url: URL): Promise<any> {
        const response: any = await axios(url.href, {
            method: "GET",
        })
        .catch( (error) => {
            console.error(`Unexpected error querting NFD API to url '${url.href}' | ${error}`);
            return null;
        });

        if (response && response.status === 200) {
            return await response.data;
        }
        return null;
    }

}