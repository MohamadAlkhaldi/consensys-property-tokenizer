import React from "react";
import Property from './Property'
import { Heading, Card } from "rimble-ui";

export default class PropertiesList extends React.Component {
  state = { getPropertiesKey: null,};

render() {
    const { drizzle, drizzleState } = this.props;
    let propertiesContracts = drizzle.contracts
    return (
        <div>
            <Card width={"auto"} maxWidth={"80%"} mx={"auto"} px={[3, 3, 4]}>
                <Heading as={'h3'}>Added Properties:</Heading>
            </Card>
                {    
                Object.keys(propertiesContracts).map(function(key, index) {
                    if(key != 'PropertyFactory'){
                        return <Property propertyContractName={key} drizzle={drizzle} drizzleState={drizzleState}/>
                    }
                })
                }
        </div>
    )
  }
}