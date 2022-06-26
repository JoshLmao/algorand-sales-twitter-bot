import { ESaleLocation, NFTSale }from "../types";
import TweetFormatter from "../TweetFormatter";
import { NFDAPI, NFDFullView } from "../nfd";

describe("Tests based on custom TweetFormatter", () => {

    const _testSale: NFTSale = {
        assetId: 1234567,
        name: "Format Test Sale",
        receiver: "XXXXXXXXXXXXXX",
        ualgos: 420 * 1000000,
        usdPrice: 420 / 0.35,
        nftxUrl: "https://nftexplorer.app/asset/1234567",
        epochMs: new Date().getTime(),
        saleLocation: ESaleLocation.AB2,
    };

    
    it("Regular Sale", async () => {

        const format: string = `{name}\n{algos}\n{usdPrice}\n{shortReceiver}\n{nftxUrl}`;
        
        let tweet: string = TweetFormatter.ParseCustomTweetFormat(format, _testSale);

        const parts: string[] = tweet.split("\n");

        expect(parts.length).toEqual(5);

        expect(parts[0]).toEqual(_testSale.name);
        expect(parts[1]).toEqual( (_testSale.ualgos / 1000000).toString() );
        expect(parts[2]).toEqual(_testSale.usdPrice.toString());
        expect(parts[3]).toEqual("XXXX...XXXX");
        expect(parts[4]).toEqual(_testSale.nftxUrl);

    })

    it("NFD Sale", async () => {

        // JoshLmao's address, will always own joshlmao.algo
        const addressWithNfd = "JOSHACIBJSSE2CA4VINXGAWAZ4KHA5S4Q2CLITWGUFD62R2JFAE56W6K5U";
        // Input format
        const format: string = `{name}\n{algos}\n{usdPrice}\n{shortReceiver}\n{nfdTwitterHandle}\n{nftxUrl}`;

        const views: NFDFullView[] | null = await NFDAPI.FindNFD(addressWithNfd);
        if (views === null) {
            fail(`Error getting NFD related views for address '${addressWithNfd}'`);
        }
        else {
            if (views.length <= 0) {
                fail(`Unable to find any related NFDs by address '${addressWithNfd}'. This address needs to own an NFD`);
            }

            const twitterView: NFDFullView | null = NFDAPI.GetFirstVerifiedTwitter(views);
            if (!twitterView) {
                fail(`Unable to obtain an NFD with a verified twitter from list of '${views.length}' for address '${addressWithNfd}'`);
            }

            let formattedTweet: string = TweetFormatter.ParseNFDFormatting(format, twitterView);
            formattedTweet = TweetFormatter.ParseCustomTweetFormat(formattedTweet, _testSale);

            const parts: string[] = formattedTweet.split("\n");
            
            expect(parts[0]).toEqual(_testSale.name);
            expect(parts[3]).toEqual("joshlmao.algo");
            expect(parts[4]).toEqual("@joshlmao");
        }
    });

    it ("NFD Formatting with non-NFD-owning reciever", async () => {

        const addressWithoutNfd: string = "L2V5PB5OBF6RWQQ27GZE3PR26MXNP7KUO6LF3GSBIRYG3KY37GM4T5PMLQ";
        const copySale = {
            ..._testSale,
            receiver: addressWithoutNfd,
        };

        // Get any NFDs
        const views: NFDFullView[] | null = await NFDAPI.FindNFD(addressWithoutNfd);
        if (views === null) {
            fail(`Unexpected error calling NFD API`);
        }

        // Should have 0 values
        expect(views.length).toEqual(0);

        // Format string with NFD and sale
        const nfdFormat: string = `{name}\n{algos}\n{usdPrice}\n{shortReceiver}\n{nfdTwitterHandle}\n{nftxUrl}`;
        let formattedTweet: string = TweetFormatter.ParseNFDFormatting(nfdFormat, null);
        formattedTweet = TweetFormatter.ParseCustomTweetFormat(formattedTweet, copySale);

        const parts: string[] = formattedTweet.split("\n");
        expect(parts.length).toEqual(6);
        expect(parts[0]).toEqual(copySale.name);
        expect(parts[1]).toEqual( (copySale.ualgos / 1000000).toString() );
        expect(parts[2]).toEqual(copySale.usdPrice.toString());
        expect(parts[3]).toEqual(`${addressWithoutNfd.slice(0, 4)}...${addressWithoutNfd.slice(addressWithoutNfd.length - 4, addressWithoutNfd.length)}`);
        expect(parts[4]).toEqual("");   //expect {nfdTwitterHandle} to be blank
        expect(parts[5]).toEqual(copySale.nftxUrl);
    });
});