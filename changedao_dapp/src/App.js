import { useAddress, useNetwork, ConnectWallet, useContract, useNFTBalance, Web3Button } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';
import styled from "styled-components";
import './App.css';

function App() {

  const address = useAddress();
  const network = useNetwork();
  console.log("Welcome Address: ", address);

  const editionDropAddress = "0xf9cd13891F1f6420F9AaD6eA413001A1EE519383";
  const { contract: token } = useContract("0x66E1aBF1845a6447919ea1F229eEB4D8d43a0d35", "token");
  const { contract: vote } = useContract("0x84036E1a30Fb329db2ec5660DD8e0Dc44af1eB45", "vote");
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");

  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");



  if(!address) {
    return (
      <div className="landing">
        <img src={`https://file.rendit.io/n/UXG4I2PJnr0vTyuJX98U.png`} />
        <h1>Welcome to Change Dao</h1>
        <div className="btn-hero">
          <ConnectWallet 
          colorMode="dark"
          accentColor="#06b6d4"
        
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Welcome to Change DAO! the place to make proposals to change and impact positively your community</h1>
      <div className="btn-hero">
        <Web3Button
          colorMode="dark"
          accentColor="#06b6d4"
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your membership NFT (Free)
        </Web3Button>
      </div>
    </div>
  );
}

export default App;
