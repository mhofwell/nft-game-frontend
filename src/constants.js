const CONTRACT_ADDRESS = "0x2632efd5CF9d18182Fa6976A1f202622f9d4b55C";

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