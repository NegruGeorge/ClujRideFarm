import React, { Component } from 'react'
import Web3 from 'web3';
import LeuToken from "../abis/LeuToken.json";
import CBikeToken from "../abis/CBikeToken.json";
import RideFarm from "../abis/RideFarm.json";

import Navbar from './Navbar'
import './App.css'
import Main from "./Main";

class App extends Component {


  async componentWillMount()
  {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }



  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    console.log(accounts);
    this.setState({account:accounts[0]})

    const networkId = await web3.eth.net.getId();

    // //load leuToken
    const leuTokenData = LeuToken.networks[networkId]
    if(leuTokenData){
      const leuToken = new web3.eth.Contract(LeuToken.abi,leuTokenData.address)
      this.setState({leuToken})
      let leuTokenBalance = await leuToken.methods.balanceOf(this.state.account).call()
      this.setState({leuTokenBalance: leuTokenBalance.toString()})
      // console.log({balance: leuTokenBalance})
    }else{
      window.alert("leuToken contract not deployed to detected network")
    }

    // CBikeToken
    const cBikeTokenData = CBikeToken.networks[networkId]
    if(cBikeTokenData){
      const cBikeToken = new web3.eth.Contract(CBikeToken.abi,cBikeTokenData.address)
      this.setState({cBikeToken})
      let cBikeTokenBalance = await cBikeToken.methods.balanceOf(this.state.account).call()
      this.setState({cBikeTokenBalance: cBikeTokenBalance.toString()})
      // console.log({balance: leuTokenBalance})
    }else{
      window.alert("cBikeToken contract not deployed to detected network")
    }


    const rideFarmData = RideFarm.networks[networkId]
    if(rideFarmData){
      const rideFarm = new web3.eth.Contract(RideFarm.abi,rideFarmData.address)
      this.setState({rideFarm})
      let stakingBalance = await rideFarm.methods.stakingBalance(this.state.account).call()
      this.setState({stakingBalance: stakingBalance.toString()})
    }else{
      window.alert("RideFarm contract not deployed to detected network")
    }

    console.log('done')
    this.setState({loading:false})


  }
 

  async loadWeb3(){
    if(window.ethereum)
    {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. yous sould consider trying MetaMask!')
    }

  }

  stakeTokens = (amount) =>{
    this.setState({loading:true})
    this.state.leuToken.methods.approve(this.state.rideFarm._address,amount).send({from:this.state.account}).on('transactionHash',(hash)=>{
      this.state.rideFarm.methods.stakeTokens(amount).send({from:this.state.account}).on('transactionHash',(hash)=>{
        this.setState({loading:false})
      })
    })
  }

  unstakeTokens = (amount)=>{
    this.setState({loading:true})
    this.state.rideFarm.methods.unstakeTokens().send({from:this.state.account}).on('trasnsactionHash',(hash)=>{
      this.setState({loading:false})
    })
  }



  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      leuToken: {},
      cBikeToken: {},
      rideFarm:{},
      leuTokenBalance:'0',
      cBikeTokenBalance:'0',
      stakingBalance:'0',
      loading:true
    }
  }
  render() {
    let content
    if(this.state.loading)
    {
      content = <p id="loader" className="text-center">Loading...</p>
    }else{
      content = <Main
      leuTokenBalance = {this.state.leuTokenBalance}
      cBikeTokenBalance = {this.state.cBikeTokenBalance}
      stakingBalance = {this.state.stakingBalance}
      stakeTokens = {this.stakeTokens}
      unstakeTokens = {this.unstakeTokens}

      
      />
    }


    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

               {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
