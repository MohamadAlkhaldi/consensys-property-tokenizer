import React from "react";
import { Box, Card, Flex, Heading, Text, Table  } from 'rimble-ui';
// import { newContextComponents } from "@drizzle/react-components";
// const { AccountData, ContractData, ContractForm } = newContextComponents;
import HoldersList from './HoldersList'

export default class Property extends React.Component {
  state = { ownerKey : null,
            holdersKey : null,
            holdersSellingKey : null, 
            holdersRevenueKey : null,
            propertyRevenueKey : null,
            propertyInfoKey : null,
            supplyKey : null,
            activeAccount : null
        };

  componentDidMount= async () => {
    const { drizzle, drizzleState, propertyContractName } = this.props;
    // console.log(propertyContractName)
    const contract = drizzle.contracts[propertyContractName];
    
    const ownerKey = contract.methods["owner"].cacheCall();
    const holdersKey = contract.methods["getHolders"].cacheCall();
    // const holdersSellingKey = contract.methods["holdersSelling"].cacheCall();
    // const holdersRevenueKey = contract.methods["holdersRevenue"].cacheCall();
    const propertyRevenueKey = contract.methods["propertyRevenue"].cacheCall();
    const propertyInfoKey = contract.methods["propertyInfo"].cacheCall();
    const supplyKey = contract.methods["totalSupply"].cacheCall();

    let activeAccount = window.web3.currentProvider.selectedAddress

    this.setState({
        ownerKey,
        holdersKey,
        // holdersSellingKey, 
        // holdersRevenueKey,
        propertyRevenueKey,
        propertyInfoKey,
        supplyKey,
        activeAccount
    })

    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
        let activeAccount = selectedAddress
        this.setState({ activeAccount});
    })
}


render() {
    const { drizzle, drizzleState, propertyContractName } = this.props;
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
    
    return (
        <div>
            {/* <Flex> */}
                <Card width={"auto"} maxWidth={"80%"} mx={"auto"} px={[3, 3, 4]}>
                    <h3>{this.props.propertyContractName}</h3>
                    <Heading.h5 color="#666">{ owner ? owner.value : null}</Heading.h5>
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
                    <Table>
                        <thead>
                            <tr>
                                <th>Holder</th>
                                <th>Shares</th>
                                <th>Revenue</th>
                                <th>Selling</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                holders ?
                                     <HoldersList 
                                        holdersList={holders} 
                                        propertyContractName={propertyContractName} 
                                        drizzle={drizzle} drizzleState={drizzleState}
                                        activeAccount={this.state.activeAccount}
                                     />     
                                : null
                            }
                            
                        </tbody>
                    </Table>
                </Card>
            {/* </Flex> */}
                {/* <p>------------------------------------------------------</p> */}
            

            
        </div>
    )
  }
}