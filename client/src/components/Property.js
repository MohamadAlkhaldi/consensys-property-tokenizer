import React from "react";
import { Box, Card, Flex, Button, Text, Table  } from 'rimble-ui';
// import { newContextComponents } from "@drizzle/react-components";
// const { AccountData, ContractData, ContractForm } = newContextComponents;
import HoldersList from './HoldersList'

export default class Property extends React.Component {
    constructor (props) {
        super(props)
        this.state = { ownerKey : null,
                    holdersKey : null,
                    holdersSellingKey : null, 
                    holdersRevenueKey : null,
                    propertyRevenueKey : null,
                    propertyInfoKey : null,
                    supplyKey : null,
                    activeAccount : null,
                    stackId : null
                };
        this.handlePayRent = this.handlePayRent.bind(this)
        this.handleDistributeRevenue = this.handleDistributeRevenue.bind(this)
    }

  componentDidMount= async () => {
    const { drizzle, drizzleState, propertyContractName } = this.props;
    const contract = drizzle.contracts[propertyContractName];
    // console.log(contract.web3.eth.send)
    
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

handlePayRent = async () => {
    const { drizzle, drizzleState, propertyContractName } = this.props;
    
    const contract = drizzle.contracts[propertyContractName]
    let propertyContractAddress = contract.address

    let amount = Number(prompt('Enter the amount of ETH you want to pay'))

    if(amount){
        await contract.web3.eth.sendTransaction({from: this.state.activeAccount, to: propertyContractAddress, value: drizzle.web3.utils.toWei(`${amount}`, 'ether')})
    }
}

handleDistributeRevenue (){
    const { drizzle, drizzleState, propertyContractName } = this.props;

    const contract = drizzle.contracts[propertyContractName]

    let stackId = contract.methods['distributeRevenue'].cacheSend({from: this.state.activeAccount})

    this.setState({stackId})
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
                    {/* <Heading.h5 color="#666">{ owner ? owner.value : null}</Heading.h5> */}
                    {/* <p>{ holdersSelling }</p>
                    <p>{ holdersRevenue }</p> */}
                    <Flex>
                        <Box width={1/2}>
                            <Text>Property Revenue: { propertyRevenue ? `${drizzle.web3.utils.fromWei(propertyRevenue.value, 'ether')} ETH` : null }</Text>
                            <Text>
                                { 
                                    propertyInfo ?
                                    `Address: ${propertyInfo.value._address}S
                                    Description: ${propertyInfo.value._description} 
                                    Price: ${drizzle.web3.utils.fromWei(propertyInfo.value.price, 'ether')} ETH`
                                    : null 
                                }
                            </Text>
                            <Text>
                                Number of shares: { supply ? supply.value + ` for ${drizzle.web3.utils.fromWei(`${(propertyInfo && propertyInfo.value.price) / supply.value}`, 'ether')} ETH each` : null }
                            </Text>
                        </Box>
                        <Box width={1/4}></Box>
                        <Box width={1/4}>
                            <Button size='small' m='1' onClick={this.handlePayRent}>Pay Rent</Button>
                            <Button size='small' m='1' onClick={this.handleDistributeRevenue}
                                    disabled={this.state.activeAccount == (owner && owner.value.toLowerCase()) ? false : true}
                            >
                                Distribute Revenue
                            </Button>
                        </Box>
                    </Flex>
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