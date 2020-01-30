import React from "react";
import { Button, Flex, Box, Form, Input, Field } from 'rimble-ui';

export default class CreatePropertyForm extends React.Component {
    constructor(props){
        super(props)
        this.state = { 
            validated: null,
            addressValue: '',
            descriptionValue: '',
            priceValue: '',
            numberOfSharesValue: '',
        };
        this.handleAddressInput = this.handleAddressInput.bind(this)
        this.handleDescriptionInput = this.handleDescriptionInput.bind(this)
        this.handlePriceInput = this.handlePriceInput.bind(this)
        this.handleNumberOfSharesInput = this.handleNumberOfSharesInput.bind(this)
        this.validateForm = this.validateForm.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleAddressInput = e => {
        this.setState({addressValue: e.target.value});
        this.validateInput(e);
        // this.validateForm();
    };

    handleDescriptionInput = e => {
      this.setState({descriptionValue: e.target.value});
      this.validateInput(e);
    //   this.validateForm();
    };

    handlePriceInput = e => {
      this.setState({priceValue: e.target.value}, () => this.validateForm());
      this.validateInput(e);
    };

    handleNumberOfSharesInput = e => {
      this.setState({numberOfSharesValue: e.target.value}, () => this.validateForm());
      this.validateInput(e);
    };
    
    validateInput = e => {
      e.target.parentNode.classList.add("was-validated");
    };
    
      validateForm = () => {
        if (
            this.state.priceValue > 0 &&
            this.state.numberOfSharesValue > 0
        ) {
          this.setState({validated: true});
        } else {
          this.setState({validated: false});
        }
      };
    
      handleSubmit = e => {
        e.preventDefault();
        this.props.createNewContractUsingFactory(this.state.addressValue, this.state.descriptionValue, this.state.priceValue, this.state.numberOfSharesValue)
      };
    

    render() {
        return (
            <Form onSubmit={this.handleSubmit} validated={this.formValidated}>
                <h3>Add your property info here</h3>
                <Flex mx={-3} flexWrap={"wrap"}>
                    <Box width={[1, 1, 1/2]} px={3}>
                    <Field label="Property Address" validated={this.state.validated} width={1}>
                        <Input
                        type="text"
                        required
                        onChange={this.handleAddressInput}
                        value={this.state.addressValue}
                        width={1}
                        />
                    </Field>
                    </Box>
                    <Box width={[1, 1, 1/2]} px={3}>
                    <Field label="Property Description" validated={this.state.validated} width={1}>
                        <Input
                        type="text"
                        required
                        onChange={this.handleDescriptionInput}
                        value={this.state.descriptionValue}
                        width={1}
                        />
                    </Field>
                    </Box>
                    <Box width={[1, 1, 1/2]} px={3}>
                    <Field label="Total Price in ETH" validated={this.state.validated} width={1}>
                        <Input
                        type="number"
                        required
                        onChange={this.handlePriceInput}
                        value={this.state.priceValue}
                        width={1}
                        />
                    </Field>
                    </Box>
                    <Box width={[1, 1, 1/2]} px={3}>
                    <Field label="Number of Shares" validated={this.state.validated} width={1}>
                        <Input
                        type="number"
                        required 
                        onChange={this.handleNumberOfSharesInput}
                        value={this.state.numberOfSharesValue}
                        width={1}
                        />
                    </Field>
                    </Box>
                    <Box>
                        <Button type="submit" disabled={!this.state.validated}>
                            Deploy
                        </Button>
                    </Box>
                </Flex>
            </Form>
        )
    }
}