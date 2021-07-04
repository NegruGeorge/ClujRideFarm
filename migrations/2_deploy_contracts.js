
const CBikeToken = artifacts.require("CBikeToken");
const LeuToken = artifacts.require("LeuToken");
const RideFarm = artifacts.require("RideFarm");

module.exports = async function(deployer,network,accounts) {
  await deployer.deploy(CBikeToken);
  const cBikeToken = await CBikeToken.deployed();


  await deployer.deploy(LeuToken);
  const leuToken= await LeuToken.deployed();

  await deployer.deploy(RideFarm, cBikeToken.address,leuToken.address);
  const rideFarm = await RideFarm.deployed();

  // transfer all the CBike tokens to the RideFarm 
  await cBikeToken.transfer(rideFarm.address,"1000000000000000000000000");

  // transfer 10 lei to an account
  await leuToken.transfer(accounts[1], '10000000000000000000')

};
