import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import GameContract from "./utils/GameContract.json";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";
// Ethereum
import { ethers } from "ethers";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // state

  const [account, setAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /*
   * Start by creating a new action that we will run on component load
   */
  // Actions

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("Please switch to Rinkeby! You're not on the right network!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("No wallet detected!");
        setIsLoading(false);
        return;
      } else {
        console.log("ETH object found.", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setAccount(account);
        } else {
          console.log("No authorized account found.");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!account) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          {/*
           * Button that we will use to trigger wallet connect
           * Don't forget to add the onClick event to call your method!
           */}
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet to FIGHT
          </button>
        </div>
      );
    } else if (account && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (account && characterNFT) {
      return (
        <Arena
          account={account}
          characterNFT={characterNFT}
          setCharacterNFT={setCharacterNFT}
        />
      );
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("You need to get MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log(
        "Checking for your character NFT on your wallet address:",
        account
      );

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GameContract.abi,
        signer
      );
      const txn = await gameContract.returnUsersNFT();
      console.log(txn);
      if (txn.name) {
        console.log("User has the character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No Character NFT Found");
      }
      setIsLoading(false);
    };

    if (account) {
      console.log("Current Account", account);
      fetchNFTMetadata();
    }
  }, [account]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
