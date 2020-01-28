import React from "react";
import Property from "../contracts/Property.json";
// import DisplayValue from "./DisplayValue";
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReducers } from "@drizzle/store";
import PropertiesList from './PropertiesList'
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class CreateProperty extends React.Component {
  state = { getPropertiesKey: null, stackId: null, newContractAddedToDrizzle: true};

  componentDidMount= async () => {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.PropertyFactory;
    const getPropertiesKey = contract.methods["getProperties"].cacheCall();
    // let activeAccount = window.web3.currentProvider.selectedAddress
    this.setState({ getPropertiesKey });
    setTimeout(() => {
        let deployedPropertiesList = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
        for(let i = 0; i < deployedPropertiesList.length; i++){
            this.addNewContractToDrizzle(deployedPropertiesList[i], i)
        }
     }, 1000)
}


 createNewContractUsingFactory = async () => {
     const { drizzle, drizzleState } = this.props;
     const contract = drizzle.contracts.PropertyFactory;
     let propertiesLengthBefore = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value.length
    //   console.log(drizzleState.contracts.PropertyFactory.events[0] && drizzleState.contracts.PropertyFactory.events[0].event)
     const stackId = await contract.methods["createProperty"].cacheSend('add', 'desc', 1000, 10, {from : window.web3.currentProvider.selectedAddress, gasLimit: 3000000})
     this.setState({ stackId, newContractAddedToDrizzle: false });
    //  setTimeout(() => {
        //  console.log(stackId, this.props.drizzleState.contracts.PropertyFactory)
    //     let properties = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
    //     let propertiesLengthAfter = properties.length
    //     if(propertiesLengthAfter > propertiesLengthBefore){
    //         let newPropertyAddress = properties[properties.length-1]
    //         this.addNewContractToDrizzle(newPropertyAddress, properties.length)
    //     }
    //  }, 1000)

}

getTxStatus = () => {
    // console.log('here')
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    /*here we are listening for added contracts, when check the following:
    createNewContractUsingFactory is called state.newContractAddedToDrizzle becomes false which means new contract added but not yet added to drizzle.
    contract in not added untill tx status is 'success'
    then we wait untill getproperties is updated
    then we call addNewContractToDrizzle to do just what the name impiles
    after addNewContractToDrizzle excution state.newContractAddedToDrizzle will go false again waiting for a new contract to be added
    */ 
    if((transactions[txHash] && transactions[txHash].status == 'success') && !this.state.newContractAddedToDrizzle){
        let properties = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
        if(properties[properties.length-1]){
            let newPropertyAddress = properties[properties.length-1]
            console.log(newPropertyAddress, properties.length)
            this.addNewContractToDrizzle(newPropertyAddress, properties.length)
        }
        // console.log(transactions[txHash].receipt.events.NewPropertyAdded)
    }
    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

//   componentDidUpdate(prevProps, prevState) {
//     if(this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey]){
//         // console.log(prevState.newContractAddedToDrizzle != this.state.newContractAddedToDrizzle)
//         // console.log(!this.state.newContractAddedToDrizzle)
//         console.log((prevState.newContractAddedToDrizzle != this.state.newContractAddedToDrizzle) && !this.state.newContractAddedToDrizzle)
//     if((prevState.newContractAddedToDrizzle != this.state.newContractAddedToDrizzle) && !this.state.newContractAddedToDrizzle){
//         let properties = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
//         let newPropertyAddress = properties[properties.length-1]
//         console.log(newPropertyAddress, properties.length)
//         this.addNewContractToDrizzle(newPropertyAddress, properties.length)
//     }
// }
//   }

addNewContractToDrizzle = (contractAddress, index) => {
    let contractName = `property${index}`
        if(!this.props.drizzle.contracts[contractName]){
        let contractABI = Property['abi']
        // console.log(Property['abi'])
        let web3Contract = new this.props.drizzle.web3.eth.Contract(Property['abi'], contractAddress)
                                                
        let contractConfig = { contractName, web3Contract }
        let events = ['ShareBought', 'HolderStatusChanged', 'RevenueDistributed', 'HolderRemoved', 'RevenueWithdrawal']
    
        // // Using the Drizzle context object
        this.props.drizzle.addContract(contractConfig, events)
        this.setState({newContractAddedToDrizzle: true})
    }
  }

  getOwner = async () => {
      const {drizzle , drizzleState} = this.props
    //   let owner = await drizzle.contracts.property3.methods.owner().call()
      console.log('drizzle', drizzle.contracts)
      console.log('drizzleState', drizzleState.contracts)
  }

render() {
    const { drizzle , drizzleState } = this.props;
    let storedData = drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey]
    return (
        <div>
            <div>{this.getTxStatus()}</div>
            <button onClick={() => this.createNewContractUsingFactory()}>Add property</button>

            <button onClick={() => this.getPropertiesFromState()}>Get property</button>
            {
                storedData ?
                <ul>
                    {storedData.value.map(function(item) {
                    return <li key={item}>{item}</li>;
                    })}
                </ul> 
            //     <PropertiesList 
            //     drizzle={this.props.drizzle}
            //     drizzleState={this.props.drizzleState}
            //     deployedProperties={storedData.value}
            // />
                : null
            }
            <div className="section">
                <h2>Active Account</h2>
                <AccountData accountIndex={0} units="ether" precision={3} drizzle={drizzle} drizzleState={drizzleState}/>
            </div>
            <button onClick={this.getOwner}>getOwner</button>
           
            {/* <div className="section">
                <h2>PropertyFactory</h2>
                <p>
                    <strong>Stored Value: </strong>
                    <ContractData contract="PropertyFactory" method="getProperties" drizzle={drizzle} drizzleState={drizzleState}/>
                </p> */}
                {/* <ContractForm 
                    contract="PropertyFactory" 
                    method="createProperty"
                    sendArgs={{from: drizzleState.accounts[0], gasLimit: 3000000}}
                    drizzle={drizzle} drizzleState={drizzleState}
                 /> */}
            {/* </div> */}
        </div>
    )
  }
}