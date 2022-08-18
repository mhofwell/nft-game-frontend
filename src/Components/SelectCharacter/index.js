import React, { useState, useEffect } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import GameContract from "../../utils/GameContract.json";
import LoadingIndicator from "../LoadingIndicator";

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  // Actions

  const mintCharacterNFTAction = async (index) => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log("Minting character in progress..");
        const mintTxn = await gameContract.mintGameNFT(index);
        await mintTxn.wait();
        console.log("mintTxn", mintTxn);
        setMintingCharacter(false);
      }
    } catch (e) {
      console.warn("Mint error:", e);
      setMintingCharacter(false);
    }
  };

  // Render Methods
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img
          src={`https://ipfs.io/ipfs/${character.imageURI}`}
          alt={character.name}
        />

        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GameContract.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found.");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllCharacters();
        console.log("charactersTxn:", charactersTxn);

        /*
         * Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex}`
      );

      alert(
        `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );
      /*
       * Once our character NFT is minted we can fetch the metadata from our contract and set it in state to move onto the Arena
       */

      if (gameContract) {
        const characterNFT = await gameContract.returnUsersNFT();
        console.log("CharacterNFT:", characterNFT);
      }
    };

    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();

      /* NFT Minted Listener */
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }
    return () => {
      /* when your component unmounts, clean up the listener */
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {/* Only show this when there are characters in state */}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting in progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
