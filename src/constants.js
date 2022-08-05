const CONTRACT_ADDRESS = "0x8891Ffb8344F51803eF905d37ee053095942869c";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHP: characterData.maxHP.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export {CONTRACT_ADDRESS, transformCharacterData}; 