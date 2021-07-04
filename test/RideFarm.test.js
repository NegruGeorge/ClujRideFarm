const { assert } = require('chai');


const _deploy_contracts = require('../migrations/2_deploy_contracts');
const CBikeToken = artifacts.require("CBikeToken");
const LeuToken = artifacts.require("LeuToken");
const RideFarm = artifacts.require("RideFarm");

// testing with chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n){
    return  web3.utils.toWei(n,'ether')
}


    contract('RideFarm',([owner,investor])=>{
        let leuToken, cBikeToken, rideFarm
        before(async ()=>{
            leuToken = await LeuToken.new()
            cBikeToken = await CBikeToken.new()
            rideFarm = await RideFarm.new(cBikeToken.address,leuToken.address)
        
        // transfer all CBike tokens to the dapp
        await cBikeToken.transfer(rideFarm.address,tokens('1000000'))

        // send some lei to one account (to one investor)
        //acounts[0] este ownerul 
        await leuToken.transfer(investor,tokens('10'),{from:owner})
        })

        describe('Leu deploy',async()=>{
            it('has a name',async () =>{
                const name = await leuToken.name()
                assert.equal(name,"Leu Token");
            })
        })

        describe('CBike Token deploy',async()=>{
            it('has a name',async () =>{
                const name = await cBikeToken.name()
                assert.equal(name,"CBike Token");
            })
        })

        describe('RideFarm deploy',async()=>{
            it('has a name',async () =>{
                const name = await rideFarm.name()
                assert.equal(name,"Dapp Ride Farm");
            })
            // check if dapp have all the cbike tokens
            it('contract have some tokens',async()=>{
                let bal = await cBikeToken.balanceOf(rideFarm.address)
                assert.equal(bal.toString(),tokens('1000000'));
            })
        })
        describe('Earn Cluj Ride tokens',async()=>{
            it('investor stake tokens to our app ',async () =>{
              let result = await leuToken.balanceOf(investor)
            // check if user have 10 tokens
              assert.equal(result.toString(),tokens("10"),"investor ballance correct ")


            // add leu to get CBike Tokens

            await leuToken.approve(rideFarm.address,tokens('10'),{from:investor})
            await rideFarm.stakeTokens(tokens('10'),{from:investor})
            

            // we check that the investor ballance is correct and he is stacking tokens on our app

            result = await leuToken.balanceOf(investor);
            assert.equal(result.toString(),tokens('0'),'invstor ballance is correct after deposit');
            
            result = await leuToken.balanceOf(rideFarm.address);
            assert.equal(result.toString(),tokens('10'),'now our app have the investor money');
            

            result = await rideFarm.isStaking(investor)
            assert.equal(result.toString(),'true','investor status correct (he is staking on our app)')
    

            // giving tokens to people

            await rideFarm.issueTokens({from:owner});

            // check the ballance after we give tokens to people
            result = await cBikeToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('1'),'investor balance correct after reciving CBR tokens');
                
            // test that olny the owner can issue owner
            await rideFarm.issueTokens({from:investor}).should.be.rejected;
            

            // unstake leu
            await rideFarm.unstakeTokens({from:investor})

            // unstake LEU aded ( unstake the token that you staked for CBK) 

            result = await leuToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('10'),'investor leu tokens after staking')

            result = await leuToken.balanceOf(rideFarm.address)
            assert.equal(result.toString(),tokens('0'),'Ride Farm   leu tokens after the investor unstake the LEU')
            
            result = await rideFarm.stakingBalance(investor)
            assert.equal(result.toString(),tokens('0'),'investor leu tokens  on the app after the investor unstake the LEU ')

            result = await rideFarm.isStaking(investor)
            assert.equal(result.toString(),'false','the investor do not appear on the app as if he is staking  ')

            })


            
        })

    })