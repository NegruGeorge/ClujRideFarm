import { throws } from 'assert';
import React, { Component } from 'react'
import leu from "../coin-stack.png";

class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">

          <table className="table table text-muted text-center">
            <thead>
              <tr>
                <th scope="col">Staking Balance</th>
                <th scope="col">Reward Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{window.web3.utils.fromWei(this.props.stakingBalance,"Ether")} LEU</td>
                <td>{window.web3.utils.fromWei(this.props.cBikeTokenBalance,"Ether")} CBK</td>
              </tr>
            </tbody>
          </table>
          <div className="card mb-4">
            <div className="card-body">
              
              <form className="mb-3" onSubmit={(event)=>{
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount,"Ether")
                this.props.stakeTokens(amount)
              }}>
                <div>
                  <label className="float-left"><b>Stake LEU to get a ride</b></label>
                  <span className='float-right test-muted'>
                    Balance:{window.web3.utils.fromWei(this.props.leuTokenBalance,'Ether')}
                  </span>
                </div>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    ref={(input)=>{this.input = input}}
                    className="form-control form-control-lg"
                    placeholder="0"
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <img src={leu} height='30' alt=""/>
                      &nbsp;&nbsp; LEU
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success btn-block btn-lg">Stake LEU</button>
              </form>
                <button
                  type="submit"
                  className="btn btn-link btn-block btn-sm"
                  onClick={(event)=>{
                    event.preventDefault()
                    // let amount
                    // amount = this.input.value.toString()
                    // amount = window.web3.utils.toWei(amount,"Ether")
                    this.props.unstakeTokens();
                  }}
                >
                  Withdraw tokens

                </button>


            </div>

          </div>
      </div>
    );
  }
}

export default Main;
