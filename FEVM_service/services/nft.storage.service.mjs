// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";
import "dotenv/config";

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from "mime";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = "";

const NEW_EVENT_NFTS = [
  {
    id: 1,
    img: "ProposalNFTImage.png",
    name: "ChangeDAO",
    description: "DAO change offers the public the ability to promote the petitions they care about to potential signers"
  },
  {
    id: 2,
    img: "ProposalNFTImage.png",
    name: "ETHOverEverything",
    description: "New decisions on crypto currencies. Let’s support digital currency to be legalized worldwide."
  },
  {
    id: 3,
    img: "ProposalNFTImage.png",
    name: "Keepgaspriceslow",
    description: "Enough is Enough, Layer 1 must support and prioritize everyday people, no more high gas prices."
  },
  {
    id: 4,
    img: "ProposalNFTImage.png",
    name: "protectouraddresses",
    description: "ZKP’s takes privacy protection to a whole new level!!"
  }
];

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
export default async function storeNFT(name, description) {
  console.log("name: ", name, " desc: ", description);
  const image = await fileFromPath(
    `./services/assets/ProposalNFTImage.png`
  );


  // create a new NFTStorage client using our API key
  let tokenAPI = process.env.NFT_STORAGE_API_KEY;
  const nftstorage = new NFTStorage({ token: tokenAPI});
  console.log("got nft storage key");

  // call client.store, passing in the image & metadata
  const result = await nftstorage.store({
    image,
    name,
    description,
  });

  console.log("result: ", result);

  return result;
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
const fileFromPath = async (filePath) => {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
};
