import { useAddress, useNetwork, ConnectWallet, useContract, useNFTBalance, Web3Button } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';
import styled from "styled-components";
import './App.css';

function App() {

  const address = useAddress();
  console.log("Welcome Address: ", address);


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
    <div><h1>Hello world!</h1></div>
  );
}

export default App;
