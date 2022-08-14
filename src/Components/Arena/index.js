import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import GameContract from "../../utils/GameContract.json";
import "./Arena.css";

/* Pass in character NFT Metadata to show the character card in our UI */

const Arena = ({ characterNFT, setCharacterNFT, account }) => {
  // State

  const [gameContract, setGameContract] = useState(null);

  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState('');

  // attack action

  const attack = async () => {

    try {
        if (gameContract) {
            setAttackState('Attacking!');
            console.log('Attacking boss...');
            const attackTxn = await gameContract.attackBoss(); 
            await attackTxn.wait(); 
            console.log('attackTxn', attackTxn);
            setAttackState('hit');
        }
    } catch (e) {
        console.error('Error attacking boss:', e);
        setAttackState('');
    }
  };

  // Page Load Effects

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
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    // Async function to fetch out boss from smart contract
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /* logic when the attack event is fired */

    const onAttackComplete = (from, newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();
        const sender = from.toString();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * If player is our own, update both player and boss Hp
        */
        if (account === sender.toLowerCase()) {

          setBoss((prevState) => {
              return { ...prevState, hp: bossHp };
          });
          setCharacterNFT((prevState) => {
              return { ...prevState, hp: playerHp };
          });
        }
        /*
        * If player isn't ours, update boss Hp only
        */
        else {
          setBoss((prevState) => {
              return { ...prevState, hp: bossHp };
          });
        }
    }

    if (gameContract) {
      // fetch boss
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
    }

    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
  }, [gameContract]);

  return (
    // boss
    <div className="arena-container">
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2> 🔥 {boss.name} 🔥 </h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss $${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHP} />
                <p>{`${boss.hp} / ${boss.maxHP} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={attack}>
              {`ATTACK ${boss.name}`}
            </button>
          </div>
        </div>
      )}
      {/* Character NFT */}
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHP} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHP} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;
