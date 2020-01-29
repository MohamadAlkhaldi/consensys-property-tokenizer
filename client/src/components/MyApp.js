import React from "react";
import CreateProperty from './CreateProperty'
import PropertiesList from './PropertiesList'
import { Heading, Card } from 'rimble-ui';

export default class MyApp extends React.Component {

render() {
    return (
        <div>
            <Card width={"auto"} maxWidth={"80%"} mx={"auto"} px={[3, 3, 4]}>
                <Heading as={'h1'} textAlign='center' >Property Tokenizer</Heading>
            </Card>
            <CreateProperty
                drizzle = {this.props.drizzle}
                drizzleState = {this.props.drizzleState}
            />
            <PropertiesList 
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
            />
        </div>
    )
  }
}