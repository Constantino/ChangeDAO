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

  const editionDropAddress = "0xa8B4066b511Ac514c5d7089dc67Ce6A7bADd0EA8";
  const { contract: token } = useContract("0x15E0508363110be4a9786814a050caB0F4dC3074", "token");
  const { contract: vote } = useContract("0x39C9fac6044563c117eCB6A5fa349681E653B3Bf", "vote");
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");

  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState();
  const [hasVoted, setHasVoted] = useState();
  
  const [createAProposal, setCreateAProposal] = useState();

  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length -4);
  }

  
  useEffect(() => {
    if(!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("Proposals:", proposals);
      } catch (error) {
        console.log("Failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  const [proposalName, setProposalName] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');

  const handleNameChange = event => {
    setProposalName(event.target.value);

    console.log('value is:', event.target.value);
  };

  const handleDescChange = event => {
    setProposalDesc(event.target.value);

    console.log('value is:', event.target.value);
  };

  const ButtonWithIconsFunction = (e, name) => {
    setCreateAProposal(!createAProposal);
  };

  const TextLabelFunction = (e, name) => {
    alert(`${name} was clicked`);
  };
  
  const TextLabel1Function = (e, _name, _desc) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "senderAddress": address,
      "name": proposalName,
      "description": proposalDesc
    });

    console.log("raw: ", raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/recordProposal", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

      setCreateAProposal(false);
  };




  if(createAProposal) {

    return (
      <MacBookProRootRootRoot>
          
          <FlexColumn1>
            <TextLabel2>Create your proposal</TextLabel2>
            <label><h1>Name</h1></label>
            <input type="text" name="name" id="name" value={proposalName} onChange={handleNameChange}/>
            <br />
            <label><h1>Description</h1></label>
            <input type="text" name="description" id="description" value={proposalDesc} onChange={handleDescChange}/>
            
            {/* <ButtonWithIcons
              onClick={(e) => ButtonWithIconsFunction(e, "ButtonWithIcons")}
            >
              <ItemWrapper>
                <Icon src={`https://file.rendit.io/n/R6p9ZsBKb5IWl2msce7u.svg`} />
                <TextLabel3>Upload</TextLabel3>
              </ItemWrapper>
            </ButtonWithIcons> */}
            <TextLabel1 onClick={(e) => TextLabel1Function(e, "TextLabel1")}>
              Submit proposal
            </TextLabel1>
          </FlexColumn1>
        </MacBookProRootRootRoot>
    )
  }

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


  if(hasClaimedNFT) {
    const voteFunction = async (e, id, type) => {
      alert(`${id} was voted, voteType: ${type}`);

      const proposal = await vote.get(id);
      // then we check if the proposal is open for voting (state === 1 means it is open)
      if (proposal.state === 1) {
        // if it is open for voting, we'll vote on it
        vote.vote(id, type);
      }

      if (proposal.state === 4) {
        vote.execute(id);
      }

    };


    

    return (
      <div>
        <VotingForumRootRootRoot>
          <TextLabel8 onClick={(e) => ButtonWithIconsFunction(e, "ButtonWithIcons")}>
              <ItemWrapper>
                <Icon src={`https://file.rendit.io/n/R6p9ZsBKb5IWl2msce7u.svg`} />
                <TextLabel3>Upload proposal</TextLabel3>
              </ItemWrapper>
          </TextLabel8>
          <FlexColumn>
            <h1>Active Proposals</h1>
            {proposals.map((proposal) => (
              <CadetBlueFlexRow>
              <FlexColumn1>
                <OsalName>Proposal Name</OsalName>
                <Text1>{ shortenAddress(proposal.proposalId.toString())}</Text1>
              </FlexColumn1>
              <FlexColumn2>
                <Text2>Description</Text2>
                <Paragraph>
                {proposal.description}
                  <br />
                </Paragraph>
              </FlexColumn2>
              <TextLabel onClick={(e) => voteFunction(e, proposal.proposalId, 1)}>
                YES
              </TextLabel>
              <TextLabel4 onClick={(e) => voteFunction(e, proposal.proposalId, 0)}>
                NO
              </TextLabel4>
            </CadetBlueFlexRow>
            ))}  
              
          </FlexColumn>
        </VotingForumRootRootRoot>
        
      </div>
    )
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


const CadetBlueFlexRow = styled.div`
  width: 862px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 25px 25px 32px 25px;
  border-radius: 10px;
  background-color: rgba(173, 173, 173, 0.3);
  margin: 10px;
`;
const FlexColumn1 = styled.div`
  width: 200px;
  gap: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0px 65px 0px 0px;
`;
const OsalName = styled.div`
  width: 112px;
  height: 18px;
  color: rgba(173, 173, 173, 0.71);
  font-size: 16px;
  font-weight: 700;
  font-family: SF Pro;
  line-height: 16px;
  text-align: center;
  letter-spacing: -0.88px;
`;
const Text1 = styled.div`
  width: 200px;
  height: 47px;
  align-self: stretch;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  font-family: SF Pro;
  line-height: 24px;
`;
const FlexColumn2 = styled.div`
  width: 367px;
  gap: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0px 60px 0px 0px;
`;
const Text2 = styled.div`
  width: 85px;
  height: 18px;
  color: rgba(173, 173, 173, 0.71);
  font-size: 16px;
  font-weight: 700;
  font-family: SF Pro;
  line-height: 16px;
  letter-spacing: -0.88px;
`;
const Paragraph = styled.div`
  width: 367px;
  height: 47px;
  align-self: stretch;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  font-family: SF Pro;
  line-height: 16px;
  letter-spacing: -0.16px;
`;
const TextLabel = styled.button`
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: flex-end;
  align-items: center;
  margin: 0px 25px 18px 0px;
  padding: 0px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  font-size: 16px;
  font-weight: 500;
  font-family: SF Pro;
  line-height: 24px;
  white-space: nowrap;
  border-width: 0px;
  border-radius: 4px;
  box-sizing: content-box;
  background-color: #00ffc1;
  cursor: pointer;
  &: hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
  } ;
`;

const TextLabel4 = styled.button`
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: flex-end;
  align-items: center;
  margin: 0px 0px 18px 0px;
  padding: 0px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  font-family: SF Pro;
  line-height: 24px;
  white-space: nowrap;
  border-width: 0px;
  border-radius: 4px;
  box-sizing: content-box;
  background-color: #ec4899;
  cursor: pointer;
  &: hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
  } ;
`;
const VotingForumRootRootRoot = styled.div`
  width: 1145px;
  
  gap: 78px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 46px 67px 46px 300px;
  background-color: #000000;
  overflow: hidden;
`;
const TextLabel8 = styled.button`
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  font-family: SF Pro;
  line-height: 36px;
  white-space: nowrap;
  border-width: 0px;
  border-radius: 76px;
  border-top-width: 4px;
  border-right-width: 4px;
  border-bottom-width: 4px;
  border-left-width: 4px;
  border-style: solid;
  border-color: #06b6d4;
  box-sizing: content-box;
  background-color: #06b6d4;
  cursor: pointer;
  &: hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
  } ;
`;
const FlexColumn = styled.div`
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
  padding: 0px 233px 0px 0px;
`;






const MacBookProRootRootRoot = styled.div`
  width: 980px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 312px 266px 309px 266px;
  background-color: #000000;
  overflow: hidden;
`;

const Image1 = styled.img`
  width: 372px;
  height: 259px;
  align-self: stretch;
`;

const TextLabel2 = styled.div`
  width: 465px;
  align-self: stretch;
  margin: 0px 0px 24px 0px;
  color: #00ffc1;
  font-size: 48px;
  font-weight: 700;
  font-family: SF Pro;
  line-height: 62.39999771118164px;
`;
const CadetBlueFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0px 0px 24px 0px;
  padding: 11px 169px 9px 168px;
  border-radius: 10px;
  background-color: rgba(173, 173, 173, 0.3);
`;
const CadetBlueFlexColumn1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0px 0px 44px 0px;
  padding: 11px 169px 9px 168px;
  border-radius: 10px;
  background-color: rgba(173, 173, 173, 0.3);
`;
const ButtonWithIcons = styled.button`
  width: 84px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 35px 173px;
  padding: 0px;
  padding-top: 8px;
  padding-right: 12px;
  padding-bottom: 8px;
  padding-left: 12px;
  border-width: 0px;
  border-radius: 4px;
  box-sizing: content-box;
  background-color: #06b6d4;
  cursor: pointer;
  &: hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
  } ;
`;
const ItemWrapper = styled.div`
  gap: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Icon = styled.img`
  width: 24px;
  height: 24px;
`;
const TextLabel3 = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  font-family: SF Pro;
  line-height: 21px;
  white-space: nowrap;
`;
const TextLabel1 = styled.button`
  gap: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 0px 119px;
  padding: 0px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 8px;
  padding-left: 16px;
  color: #00ffc1;
  font-size: 24px;
  font-weight: 600;
  font-family: SF Pro;
  line-height: 36px;
  white-space: nowrap;
  border-width: 0px;
  border-radius: 76px;
  border-top-width: 4px;
  border-right-width: 4px;
  border-bottom-width: 4px;
  border-left-width: 4px;
  border-style: solid;
  border-color: #00ffc1;
  box-sizing: content-box;
  background-color: #000000;
  cursor: pointer;
  &: hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.3);
  } ;
`;
