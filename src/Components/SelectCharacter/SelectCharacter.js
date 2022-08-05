import React, { useState, useEffect } from "react";
import "./SelectCharacter.css";

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */

const SelectCharacter = ({ setCharacterNFT }) => {
  const [character, setCharacter] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  return (
    <div className="select-character-container">
      <h2>Mint your HERO! Choose wisely. The Warlock awaits.</h2>
    </div>
  );
};

export default SelectCharacter;
