const RideFarm = artifacts.require("RideFarm");

module.exports = async function(callback) {
 
    let rideFarm = await RideFarm.deployed()
    await rideFarm.issueTokens()

    

    console.log('tokens isued');

    callback();

};
