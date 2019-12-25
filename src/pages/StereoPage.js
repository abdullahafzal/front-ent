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
  Input,
  Label,
  Row,
  FormGroup,
} from 'reactstrap';

class StereoPage extends Component {
    constructor (props) {
      super(props);
      this.state = {
        stereo_name: '',
        width: '',
        length: '',
        formErrors: {stereo_name: '',width: '',length: '',},
        stereo_nameValid: false,
        widthValid: false,
        lengthValid: false,

      }
      this.addStereo = this.addStereo.bind(this);
    }

    
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                      () => { this.validateField(name, value) });
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let stereo_nameValid = this.state.stereo_nameValid;
        let widthValid = this.state.widthValid;
        let lengthValid = this.state.lengthValid;
    
        switch(fieldName) {
          case 'stereo_name':
            stereo_nameValid = value.length >= 1;
            break;
          case 'width':
            widthValid = value.length >= 1;
            break;
            case 'length':
            lengthValid = value.length >= 1;
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        stereo_nameValid: stereo_nameValid,
                        widthValid: widthValid,
                        lengthValid: lengthValid,
                        
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({itemValid: this.state.widthValid && this.state.lengthValid,
                        categoryValid: this.state.stereo_nameValid,});
      }
    
      addStereo(event)
      {
          event.preventDefault();
          let myobject = {
            "name": this.state.stereo_name,
            "length": this.state.length,  
            "width": this.state.width,
          }
          axios.post('http://127.0.0.1:8000/app/stereo/', myobject, this.props.config)
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
                  <Label for="stereo_name" sm={2}>
                    Stereo
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="stereo_name"
                      placeholder="Enter Name"
                      value={this.state.stereo_name}
                      onChange={this.handleUserInput} 
                    />
                    </Col>
                    </FormGroup>

                    <FormGroup row>
                  <Label for="width" sm={2}>
                    Width
                  </Label>
                  <Col sm={4}>
                    <Input
                      type="text"
                      name="width"
                      value={this.state.width}
                      onChange={this.handleUserInput} 
                    />
                    </Col>
                    <Label for="length" sm={2}>
                    Length
                  </Label>
                    <Col sm={4}>
                    <Input type="text" name="length" value={this.state.length}
                               onChange={this.handleUserInput}/>
                        </Col>
                    </FormGroup>
                 
                <Button type="submit" onClick={this.addStereo} disabled={!this.state.categoryValid}>Add Category</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}
}

export default StereoPage;
