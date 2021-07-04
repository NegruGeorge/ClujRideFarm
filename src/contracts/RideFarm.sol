pragma solidity > 0.5.0;

import "./CBikeToken.sol";
import "./LeuToken.sol";

contract RideFarm{
    string public name = "Dapp Ride Farm";
    CBikeToken public cBikeToken;
    LeuToken public leuToken;

    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(CBikeToken _cBikeToken, LeuToken _leuToken) public{
        cBikeToken = _cBikeToken;
        leuToken = _leuToken;

        // the owner is the first person that deploy the smart contract with the app
        owner = msg.sender;
    }

    //  stake tokens
    function stakeTokens(uint _amount) public{
        require(_amount >0,"ammount cannot be 0");

        leuToken.transferFrom(msg.sender,address(this), _amount); 

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }      

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // withdraw tokens
    function unstakeTokens() public
    {
        uint balance = stakingBalance[msg.sender];

        require(balance >0, 'staking balance cannot be 0');

        leuToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        isStaking[msg.sender] = false;

    }

    // win tokens
        function issueTokens() public{
        require(msg.sender == owner , "caller must be the owner of the app(contract)");
        for(uint  i=0; i<stakers.length;i++)
            {
                address recipient = stakers[i];
                uint balance = stakingBalance[recipient];

                // i give them 1 CBR token for every issuance
                if(balance >0){
                     cBikeToken.transfer(recipient,1000000000000000000);
                }    
            }
    }


}