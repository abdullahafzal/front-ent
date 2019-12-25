import Page from 'components/Page';
import React , { Component } from 'react';
import { FormErrors } from './FormErrors';
import axios from 'axios';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  Row,
  FormGroup,
} from 'reactstrap';



class QualityPage extends Component {
    constructor (props) {
      super(props);
      this.state = {
        quality_name: '',
        formErrors: {quality_name: ''},
        quality_nameValid: false,

      }
      this.addQuality = this.addQuality.bind(this);
    }

    
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                      () => { this.validateField(name, value) });
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let quality_nameValid = this.state.quality_nameValid;
    
        switch(fieldName) {
          case 'quality_name':
            quality_nameValid = value.length >= 1;
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        quality_nameValid: quality_nameValid,

                        
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({quality_nameValid: this.state.quality_nameValid,});
      }
    
      addQuality(event)
      {
          event.preventDefault();
          let myobject = {
            "name": this.state.quality_name,
          }
          axios.post('http://127.0.0.1:8000/app/quality/', myobject, this.props.config)
    .then(function (response) {
      console.log("sucess");
    })
    .catch(function (error) {
      console.log(error);
    });
      }


render () {
  return (
    <Page className="header text-center" title="Add New Stereo">
      <Row>
        <Col xl={6} lg={8} md={12}>
          <Card>
            <CardHeader className="header text-center">New Stereo</CardHeader>
            <CardBody>
            <FormErrors formErrors={this.state.formErrors} />
              <Form>
                <FormGroup row>
                  <Label for="Quality_name" sm={2}>
                    Quality
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="quality_name"
                      placeholder="Enter Name"
                      value={this.state.quality_name}
                      onChange={this.handleUserInput} 
                    />
                    </Col>
                    </FormGroup>
                <Button type="submit" onClick={this.addQuality} disabled={!this.state.quality_nameValid}>Add Quality</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}
}

export default QualityPage;
