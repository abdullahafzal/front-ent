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



class itemPage extends Component {
    constructor (props) {
      super(props);
      this.state = {
        category_name: '',
        item_name: '',
        item_category: '',
        formErrors: {category_name: '',item_name: '',item_category: '',},
        category_nameValid: false,
        item_nameValid: false,
        item_categoryValid: false,
        categoryValid: false,
        itemValid: false,
        categoryList:[],

      }
      this.addItem = this.addItem.bind(this);
      this.addCategory = this.addCategory.bind(this);
    }

    componentDidMount = () => {
      axios.get('http://localhost:8000/app/item_category/', this.props.config)
      .then(response => {
          this.setState({categoryList: response.data});
      })
      .catch(function (error) {
        // handle error
        console.log("suc");
        console.log(error);
      })
      .finally(function () {
        // always executed
      });   
  };

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                      () => { this.validateField(name, value) });
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let category_nameValid = this.state.category_nameValid;
        let item_nameValid = this.state.item_nameValid;
        let item_categoryValid = this.state.item_categoryValid;
    
        switch(fieldName) {
          case 'category_name':
            category_nameValid = value.length >= 1;
            break;
          case 'item_name':
            item_nameValid = value.length >= 1;
            break;
            case 'item_category':
            item_categoryValid = value.length >= 1;
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        category_nameValid: category_nameValid,
                        item_nameValid: item_nameValid,
                        item_categoryValid: item_categoryValid,
                        
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({itemValid: this.state.item_nameValid && this.state.item_categoryValid,
                        categoryValid: this.state.category_nameValid,});
      }
    

      addCategory(event)
      {
          event.preventDefault();
          let myobject = {
              "name": this.state.category_name,
          }
          axios.post('http://127.0.0.1:8000/app/item_category/', myobject)
    .then(function (response) {
      console.log("sucess");
    })
    .catch(function (error) {
      console.log(error);
    });
      }
      addItem(event)
      {
          event.preventDefault();
          let myobject = {
            "category": this.state.item_category,  
            "name": this.state.item_name,
          }
          axios.post('http://127.0.0.1:8000/app/item/', myobject)
    .then(function (response) {
      console.log("sucess");
    })
    .catch(function (error) {
      console.log(error);
    });
      }


render () {
  return (
    <Page className="header text-center" title="Edit Items">
      <Row>
        <Col xl={6} lg={8} md={12}>
          <Card>
            <CardHeader className="header text-center">New Category</CardHeader>
            <CardBody>
            <FormErrors formErrors={this.state.formErrors} />
              <Form>
              

                <FormGroup row>
                  <Label for="category_name" sm={2}>
                    Name
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="category_name"
                      placeholder="Enter Name"
                      value={this.state.category_name}
                      onChange={this.handleUserInput} 
                    />
                    </Col>
                    </FormGroup>
                 
                <Button type="submit" onClick={this.addCategory} disabled={!this.state.categoryValid}>Add Category</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6} lg={8} md={12}>
          <Card>
            <CardHeader className="header text-center">New Item</CardHeader>
            <CardBody>
            <FormErrors formErrors={this.state.formErrors} />
              <Form>
              

                <FormGroup row>
                  <Label for="item_name" sm={3}>
                    Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="item_name"
                      placeholder="Enter Name"
                      value={this.state.item_name}
                      onChange={this.handleUserInput} 
                    />
                    </Col>
                    <Label for="category" sm={3}>
                    Category
                  </Label>
                    <Col sm={9}>
                    <Input type="select" name="item_category" value={this.state.item_category}
                               onChange={this.handleUserInput} >
                               {this.state.categoryList.map(category => <option value={category.id} key = {category.id}>{category.name}</option>)}
                             </Input>
                        </Col>
                    </FormGroup>
                <Button type="submit" onClick={this.addItem} disabled={!this.state.itemValid}>Add Item</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  )
}
}

export default itemPage;
