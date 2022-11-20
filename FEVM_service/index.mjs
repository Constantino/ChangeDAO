import express from "express";
import cors from "cors";
import "dotenv/config";
import storeNFT from "./services/nft.storage.service.mjs";
import { ethers } from "ethers";
import abi from "./contracts/ChangeDAOParticipationBackupABI.json" assert {type: 'json'};
import abiRewards from "./contracts/ChangeDAORewardsABI.json" assert {type: 'json'};

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("hello");
  
  
});


app.post("/recordProposal", async (req, res) => {
  try {
    
    const { senderAddress, name, description } = req.body;
  
    const { url } = await storeNFT(name, description);
  
    const provider = new ethers.providers.JsonRpcProvider("https://wallaby.node.glif.io/rpc/v0");
    const address = process.env.WALLET_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(process.env.PARTICIPATION_ADDRESS, abi, wallet);
    
    try {
      
      let sendPromise = await contract.backupParticipation(name, description, url);
      
      sendPromise.then(function(tx) {
        console.log(tx);
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const daoRewards = new ethers.Contract(process.env.DAO_REWARDS_ADDRESS, abiRewards, wallet);
      await daoRewards.transfer(senderAddress, "1000000000000000000");
    } catch (error) {
      console.error(error);
    }

    res.header("Access-Control-Allow-Origin", "*").status(200).send("done");
  } catch (error) {
    console.error(error);
    res.header("Access-Control-Allow-Origin", "*").status(500).send("server error");
  }


});

app.post("/upload/nft", async (req, res) => {
  console.log("req", req.body);
  const { name, desc } = req.body;
  const result = await storeNFT(name, desc);
  res.header("Access-Control-Allow-Origin", "*").status(200).send(result);
});


app.get("/read/nft", (req, res) => {
  res.send("read nft");
});

app.listen(port, () =>
  console.log("App is listening on url http://localhost:" + port)
);
