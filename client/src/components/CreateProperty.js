import React from "react";
import Property from "../contracts/Property.json";
import { Card, Heading, Text } from 'rimble-ui';
import CreatePropertyForm from './CreatePropertyForm'

export default class CreateProperty extends React.Component {
    constructor(props){
        super(props)
        this.state = { getPropertiesKey: null, 
            stackId: null, 
            newContractAddedToDrizzle: true, 
            activeAccount: null};
        this.createNewContractUsingFactory = this.createNewContractUsingFactory.bind(this)
    }

    componentDidMount= async () => {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.PropertyFactory;
        const getPropertiesKey = contract.methods["getProperties"].cacheCall();
        let activeAccount = window.web3.currentProvider.selectedAddress
        this.setState({ getPropertiesKey, activeAccount });

        //This chunk is for adding already deployed contracts into Drizzle
        let deployedPropertiesList = await contract.methods.getProperties().call()
        for(let i = 0; i < deployedPropertiesList.length; i++){
            this.addNewContractToDrizzle(deployedPropertiesList[i], i)
        }

        //Here we are listening for metamask account change, typically, the active account should be exposed through drizzleState.accounts[0]
        //but for some reason it's not working
        this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
            let activeAccount = selectedAddress

            this.setState({ activeAccount});
        })
    }

    createNewContractUsingFactory = async (_address, _description, _price, _numberOfShares) => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.PropertyFactory;

        let price = drizzle.web3.utils.toWei(_price, 'ether')
        let tx = await contract.methods.createProperty(_address, _description, price, _numberOfShares ).send({from : this.state.activeAccount, gasLimit: 3000000})

        let properties = drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey].value
        if(tx.status){
            if(tx.events.NewPropertyAdded){
                let newPropertyAddress = tx.events.NewPropertyAdded.returnValues.property
                this.addNewContractToDrizzle(newPropertyAddress, properties.length)
            }
        }
    }

    addNewContractToDrizzle = (contractAddress, index) => {
        let contractName = `Property ${index}`
        //This additional condition is to ensure a contract is not added twice to drizzle
            if(!this.props.drizzle.contracts[contractName]){
                let web3Contract = new this.props.drizzle.web3.eth.Contract(Property['abi'], contractAddress)
                                                        
                let contractConfig = { contractName, web3Contract }
                let events = ['ShareBought', 'HolderStatusChanged', 'RevenueDistributed', 'HolderRemoved', 'RevenueWithdrawal']
            
                this.props.drizzle.addContract(contractConfig, events)
                this.setState({newContractAddedToDrizzle: true})
        }
    }

    // getOwner = async () => {
    //     const {drizzle , drizzleState} = this.props
    //     console.log('drizzle', drizzle.contracts)
    //     console.log('drizzleState', drizzleState.contracts)
    // }

    render() {
        // const { drizzle , drizzleState } = this.props;
        // let storedData = drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey]
        return (
            <div>
                <br/>
                <Card width={"auto"} maxWidth={"80%"} mx={"auto"} bg={"#F0F0F0"} >
                    {/* {
                        storedData ?
                        <ul>
                            {storedData.value.map(function(item) {
                            return <li key={item}>{item}</li>;
                            })}
                        </ul>
                        : null
                    } */}
                    <div className="section">
                        {/* <h2>Active Account</h2> */}
                            <Heading as={'h3'}>Welcome {this.state.activeAccount}!</Heading>
                            <Text>We will help you tokenize your property</Text>
                    </div>
                    {/* <button onClick={this.getOwner}>Check state</button> */}
                    <CreatePropertyForm createNewContractUsingFactory={this.createNewContractUsingFactory}/>
                </Card>
                <br/>
            </div>
        )
    }
}