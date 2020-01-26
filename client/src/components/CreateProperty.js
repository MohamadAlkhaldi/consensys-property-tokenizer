import React from "react";
import Property from "../contracts/Property.json";
// import DisplayValue from "./DisplayValue";
import { newContextComponents } from "@drizzle/react-components";
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class CreateProperty extends React.Component {
  state = { getPropertiesKey: null};

  componentDidMount= async () => {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.PropertyFactory;
    const getPropertiesKey = contract.methods["getProperties"].cacheCall();
    this.setState({ getPropertiesKey });
    setTimeout(() => {
        let deployedPropertiesList = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
        console.log(deployedPropertiesList)
        for(let i = 0; i < deployedPropertiesList.length; i++){
            this.addNewContractToDrizzle(deployedPropertiesList[i], i)
        }
     }, 1000)
}


 createNewContractUsingFactory = () => {
     const { drizzle, drizzleState } = this.props;
     const contract = drizzle.contracts.PropertyFactory;
     const stackId = contract.methods["createProperty"].cacheSend('add', 'desc', 1000, 10, {gasLimit: 3000000})

     setTimeout(() => {
        let properties = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
        let newPropertyAddress = properties[properties.length-1]
        this.addNewContractToDrizzle(newPropertyAddress, properties.length-1)
     }, 1000)

}

// getPropertiesFromState() {
//     const { PropertyFactory } = this.props.drizzleState.contracts;
    
//     const storedData = PropertyFactory.getProperties[this.state.getPropertiesKey];
//     console.log(storedData)
// }

addNewContractToDrizzle = (contractAddress, index) => {
    let contractName = `property${index}`
    console.log(contractName, contractAddress)
    let contractABI = Property['abi']
    // console.log(Property['abi'])
    let web3Contract = new this.props.drizzle.web3.eth.Contract(Property['abi'], contractAddress)
                                              
    let contractConfig = { contractName, web3Contract }
    let events = ['ShareBought', 'HolderStatusChanged', 'RevenueDistributed', 'HolderRemoved', 'RevenueWithdrawal']
  
    // // Using the Drizzle context object
    this.props.drizzle.addContract(contractConfig, events)
  }

  getOwner = async () => {
      const {drizzle } = this.props
      let owner = await drizzle.contracts.property0.methods.owner().call()
      console.log(owner)
  }

render() {
    const { drizzle , drizzleState } = this.props;
    return (
        <div>
            {/* <button onClick={() => this.createNewContractUsingFactory(storedData)}>Add property</button>

            <button onClick={() => this.getPropertiesFromState()}>Get property</button>
            {
                storedData ?
                <ul>
                    {storedData.value.map(function(item) {
                    return <li key={item}>{item}</li>;
                    })}
                </ul> 
                : null
            } */}
            <div className="section">
                <h2>Active Account</h2>
                <AccountData accountIndex={0} units="ether" precision={3} drizzle={drizzle} drizzleState={drizzleState}/>
            </div>
            <button onClick={this.getOwner}>getOwner</button>
            <div className="section">
                <h2>PropertyFactory</h2>
                <p>
                    <strong>Stored Value: </strong>
                    <ContractData contract="PropertyFactory" method="getProperties" drizzle={drizzle} drizzleState={drizzleState}/>
                </p>
                <ContractForm 
                    contract="PropertyFactory" 
                    method="createProperty"
                    sendArgs={{from: drizzleState.accounts[0], gasLimit: 3000000}}
                    drizzle={drizzle} drizzleState={drizzleState}
                 />
            </div>
        </div>
    )
  }
}