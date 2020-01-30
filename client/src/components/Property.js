import React from "react";
import { Box, Card, Flex, Button, Text, Table, Heading  } from 'rimble-ui';
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
    let { ownerKey,
        holdersKey,
        propertyRevenueKey,
        propertyInfoKey,
        supplyKey
    } = this.state

    const contract = drizzleState.contracts[this.props.propertyContractName]
    let owner = contract && contract.owner[ownerKey]
    let holders = contract && contract.getHolders[holdersKey]
    let propertyRevenue = contract && contract.propertyRevenue[propertyRevenueKey]
    let propertyInfo = contract && contract.propertyInfo[propertyInfoKey]
    let supply = contract && contract.totalSupply[supplyKey]
    
    return (
        <div>
            {/* <Flex> */}
                <Card width={"auto"} maxWidth={"80%"} mx={"auto"} px={[3, 3, 4]}>
                    <Heading as={'h4'}>{this.props.propertyContractName}</Heading>
                    <Flex>
                        <Box width={1/2}>
                            { 
                                propertyInfo ?
                                <div>
                                <Text>Address: {propertyInfo.value._address}</Text>
                                <Text>Description: {propertyInfo.value._description}</Text>
                                <Text>Price: {drizzle.web3.utils.fromWei(propertyInfo.value.price, 'ether')} ETH</Text>
                                </div>
                                : null 
                            }
                            <Text>
                                Shares: { supply ? supply.value + ` for ${propertyInfo ? drizzle.web3.utils.fromWei(`${(propertyInfo.value.price) / supply.value}`, 'ether') : null} ETH each` : null }
                            </Text>
                                <Text>Property undistributed revenue: { propertyRevenue ? `${drizzle.web3.utils.fromWei(propertyRevenue.value, 'ether')} ETH` : null }</Text>
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