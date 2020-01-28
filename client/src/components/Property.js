import React from "react";
// import Property from "../contracts/Property.json";
// import { newContextComponents } from "@drizzle/react-components";
// import { drizzleReducers } from "@drizzle/store";
// const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Property extends React.Component {
  state = { ownerKey : null,
            holdersKey : null,
            holdersSellingKey : null, 
            holdersRevenueKey : null,
            propertyRevenueKey : null,
            propertyInfoKey : null,
            supplyKey : null
        };

  componentDidMount= async () => {
    const { drizzle, drizzleState, propertyContractName } = this.props;
    // const getPropertiesKey = contract.methods["getProperties"].cacheCall();
    // this.setState({ getPropertiesKey: this.props.getPropertiesKey });
    // console.log(this.props.deployedProperties)
    // console.log(this.props.propertyContractName)
    // console.log(drizzle.contracts[propertyContractName])
    
    const contract = drizzle.contracts[propertyContractName];
    // console.log()
    // return
    
    // console.log(drizzle.contracts[propertyContractName].methods)
    
    const ownerKey = contract.methods["owner"].cacheCall();
    const holdersKey = contract.methods["getHolders"].cacheCall();
    // const holdersSellingKey = contract.methods["holdersSelling"].cacheCall();
    // const holdersRevenueKey = contract.methods["holdersRevenue"].cacheCall();
    const propertyRevenueKey = contract.methods["propertyRevenue"].cacheCall();
    const propertyInfoKey = contract.methods["propertyInfo"].cacheCall();
    const supplyKey = contract.methods["totalSupply"].cacheCall();
    // console.log(contract.methods)

    this.setState({
        ownerKey,
        holdersKey,
        // holdersSellingKey, 
        // holdersRevenueKey,
        propertyRevenueKey,
        propertyInfoKey,
        supplyKey
    })
    
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
    const { drizzleState } = this.props;
    // let propertiesContracts = drizzle.contracts
    let { ownerKey,
        holdersKey,
        // holdersSellingKey, 
        // holdersRevenueKey,
        propertyRevenueKey,
        propertyInfoKey,
        supplyKey
    } = this.state
    let owner = drizzleState.contracts[this.props.propertyContractName] && drizzleState.contracts[this.props.propertyContractName].owner[this.state.ownerKey]
    let holders = drizzleState.contracts[this.props.propertyContractName] && drizzleState.contracts[this.props.propertyContractName].getHolders[this.state.holdersKey]
    // let holdersSelling = drizzleState.contracts[this.props.propertyContractName][holdersSellingKey]
    // let holdersRevenue = drizzleState.contracts[this.props.propertyContractName][holdersRevenueKey]
    let propertyRevenue = drizzleState.contracts[this.props.propertyContractName] && drizzleState.contracts[this.props.propertyContractName].propertyRevenue[propertyRevenueKey]
    let propertyInfo = drizzleState.contracts[this.props.propertyContractName] && drizzleState.contracts[this.props.propertyContractName].propertyInfo[propertyInfoKey]
    let supply = drizzleState.contracts[this.props.propertyContractName] && drizzleState.contracts[this.props.propertyContractName].totalSupply[supplyKey]
    // console.log(propertyInfo && propertyInfo.value)
    return (
        <div>
            <h3>{this.props.propertyContractName}</h3>
            <p>{ owner ? owner.value : null}</p>
            <p>
                {
                    holders ? 
                        <ul>
                            {
                                holders.value.map((value, index) => {
                                return <li>{`Holder ${index}: ${value}`}</li>
                                })
                            }
                        </ul>
                    : null
                }
            </p>
            {/* <p>{ holdersSelling }</p>
            <p>{ holdersRevenue }</p> */}
            <p>{ propertyRevenue ? propertyRevenue.value : null }</p>
            <p>{ 
                    propertyInfo ?
                    `Address: ${propertyInfo.value._address}, Description: ${propertyInfo.value._description}, Price: ${propertyInfo.value.price}`
                    : null 
                }
            </p>
            <p>Number of shares: { supply ? supply.value + ` for $${propertyInfo.value.price / supply.value} each` : null }</p>
            <p>------------------------------------------------------</p>
            

            
        </div>
    )
  }
}