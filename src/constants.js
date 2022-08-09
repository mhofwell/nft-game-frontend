const CONTRACT_ADDRESS = "0xab7AE30660B861d7B49B4a5779A530DfDa0EcEE9";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHP: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export {CONTRACT_ADDRESS, transformCharacterData};  