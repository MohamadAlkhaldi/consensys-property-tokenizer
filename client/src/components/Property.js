import React from "react";
import { Box, Card, Flex, Heading } from 'rimble-ui';
// import { newContextComponents } from "@drizzle/react-components";
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
    
    const contract = drizzle.contracts[propertyContractName];
    
    const ownerKey = contract.methods["owner"].cacheCall();
    const holdersKey = contract.methods["getHolders"].cacheCall();
    // const holdersSellingKey = contract.methods["holdersSelling"].cacheCall();
    // const holdersRevenueKey = contract.methods["holdersRevenue"].cacheCall();
    const propertyRevenueKey = contract.methods["propertyRevenue"].cacheCall();
    const propertyInfoKey = contract.methods["propertyInfo"].cacheCall();
    const supplyKey = contract.methods["totalSupply"].cacheCall();

    this.setState({
        ownerKey,
        holdersKey,
        // holdersSellingKey, 
        // holdersRevenueKey,
        propertyRevenueKey,
        propertyInfoKey,
        supplyKey
    })
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
            {/* <Flex> */}
                <Card width={"auto"} maxWidth={"80%"} mx={"auto"} px={[3, 3, 4]}>
                    <h3>{this.props.propertyContractName}</h3>
                    <Heading.h5 color="#666">{ owner ? owner.value : null}</Heading.h5>
                    <Heading.h5 color="#666">
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
                    </Heading.h5>
                    {/* <p>{ holdersSelling }</p>
                    <p>{ holdersRevenue }</p> */}
                    <Heading.h5 color="#666">{ propertyRevenue ? propertyRevenue.value : null }</Heading.h5>
                    <Heading.h5 color="#666">{ 
                            propertyInfo ?
                            `Address: ${propertyInfo.value._address}, Description: ${propertyInfo.value._description}, Price: ${propertyInfo.value.price}`
                            : null 
                        }
                    </Heading.h5>
                    <Heading.h5 color="#666">Number of shares: { supply ? supply.value + ` for $${propertyInfo.value.price / supply.value} each` : null }</Heading.h5>
                </Card>
            {/* </Flex> */}
                {/* <p>------------------------------------------------------</p> */}
            

            
        </div>
    )
  }
}