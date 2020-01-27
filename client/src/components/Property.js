import React from "react";
// import Property from "../contracts/Property.json";
// import { newContextComponents } from "@drizzle/react-components";
// import { drizzleReducers } from "@drizzle/store";
// const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Property extends React.Component {
//   state = { propertyContractName: null,};

  componentDidMount= async () => {
    const { drizzle, drizzleState, propertyContractName } = this.props;
    // const contract = drizzle.contracts.PropertyFactory;
    // const getPropertiesKey = contract.methods["getProperties"].cacheCall();
    // this.setState({ getPropertiesKey: this.props.getPropertiesKey });
    // console.log(this.props.deployedProperties)
    console.log(this.props.propertyContractName)
    console.log(drizzle.contracts[propertyContractName])
    console.log(drizzleState.contracts[propertyContractName])

    
    // setTimeout(() => {
    //     console.log(this.props.drizzleState.contracts.PropertyFactory.getProperties[this.props.getPropertiesKey])
    //     let deployedPropertiesList = this.props.drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
    //     // console.log(deployedPropertiesList)
    //     for(let i = 0; i < deployedPropertiesList.length; i++){
    //         this.addNewContractToDrizzle(deployedPropertiesList[i], i)
    //     }
    //  }, 2000)
}


render() {
    // const { drizzle } = this.props;
    // let propertiesContracts = drizzle.contracts
    // let storedData = drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey]
    return (
        <div>
            {this.props.propertyContractName}
            {/* {

            Object.keys(propertiesContracts).map(function(key, index) {
                if(index > 0){
                return <p>{key},{index-1}</p>
                }
            }) */}

            {/* } */}
            {/* <div>{this.getTxStatus()}</div> */}
            {/* <button onClick={() => this.createNewContractUsingFactory()}>Add property</button> */}

            {/* <button onClick={() => this.getPropertiesFromState()}>Get property</button> */}
            {/* {
                storedData ?
                <ul>
                    {storedData.value.map(function(item) {
                    return <li key={item}>{item}</li>;
                    })}
                </ul> 
                : null
            } */}
            {/* <div className="section">
                <h2>Active Account</h2>
                <AccountData accountIndex={0} units="ether" precision={3} drizzle={drizzle} drizzleState={drizzleState}/>
            </div>
            <button onClick={this.getOwner}>getOwner</button> */}
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