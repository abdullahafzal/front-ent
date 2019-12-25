import Page from 'components/Page';
import React, { Component } from 'react';
import axios from 'axios';
import PartyRow from './PartyRow';
import { AvForm } from 'availity-reactstrap-validation';
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  FormGroup,
  Table,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from 'reactstrap';




class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      customerId : '',
      customer: '',
      address: '',
      contact: '',
      email: '',
      ntn: '',
      gst: '',
      formErrors: { customer: '', address: '', email: '', gst: '', },
      customerValid: false,
      addressValid: false,
      contactValid: false,
      emailValid: false,
      ntnValid: false,
      gstValid: false,
      formValid: false,
      modalText: '',
    }

    this.myFunction = this.myFunction.bind(this);
  }
  componentDidMount = () => {
    axios.get('http://localhost:8000/app/customer/', this.props.config)
      .then(response => {
        this.setState({ customerList: response.data });
        console.log(this.state.customerList)
      });
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let customerValid = this.state.customerValid;
    let addressValid = this.state.addressValid;
    let emailValid = this.state.emailValid;
    let gstValid = this.state.gstValid;
    let contactValid = this.state.contactValid;
    let ntnValid = this.state.ntnValid;

    switch (fieldName) {
      case 'customer':
        customerValid = value.length >= 1;
        fieldValidationErrors.customer = customerValid ? '' : ' Enter Customer';
        break;
      case 'address':
        addressValid = value.length >= 1;
        fieldValidationErrors.address = addressValid ? '' : 'Enter Address';
        break;
      case 'contact':
        contactValid = value.length >= 1;
        fieldValidationErrors.contact = contactValid ? '' : 'Enter Contact';
        break;
      case 'email':
        emailValid = value.length >= 1;
        fieldValidationErrors.email = emailValid ? '' : ' Enter email';
        break;
      case 'ntn':
        ntnValid = value.length >= 1;
        fieldValidationErrors.ntn = ntnValid ? '' : ' Enter Ntn';
        break;
      case 'gst':
        gstValid = value.length >= 1;
        fieldValidationErrors.gst = gstValid ? '' : ' Enter gst';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      customerValid: customerValid,
      addressValid: addressValid,
      contactValid: contactValid,
      emailValid: emailValid,
      ntnValid: ntnValid,
      gstValid: gstValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.customerValid && this.state.addressValid && this.state.contactValid && this.state.gstValid && this.state.emailValid && this.state.ntnValid });
  }


  myFunction = (event) => {
    event.preventDefault();
    this.state.modalText==="Edit"? this.editCustomer() : this.addCustomer()
  }

  editCustomer = () => {
    let myobject = {
      "name": this.state.customer,
      "address": this.state.address,
      "contact": this.state.contact,
      "email": this.state.email,
      "NTN": this.state.ntn,
      "GST": this.state.gst
    }
    axios.put('http://127.0.0.1:8000/app/customer/' + this.state.customerId + "/", myobject)
    .then((response)=> {
      this.toggleAddModal();
      this.componentDidMount();
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  addCustomer = () => {
    let myobject = {
      "name": this.state.customer,
      "address": this.state.address,
      "contact": this.state.contact,
      "email": this.state.email,
      "NTN": this.state.ntn,
      "GST": this.state.gst
    }
    axios.post('http://127.0.0.1:8000/app/customer/', myobject)
    .then(function (response) {
      console.log("success");
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  toggleAddModal = () => {
    this.setState(prevState => ({
      addModal: !prevState.addModal,
      modalText:'',
      customerId:'',
      customer: '',
      address: '',
      contact: '',
      email: '',
      ntn: '',
      gst: '',
    }));
  }

  edit = (id,name,address,contact,email,NTN,GST) => {
    this.setState({
      addModal: true,
      modalText: "Edit",
      customerId:id,
      customer: name,
      address: address,
      contact: contact,
      email: email,
      ntn: NTN,
      gst: GST,
    })
  }



  render() {
    return (
      <Page className="header text-center" title="Customers">
        <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>Add New</Button>
          </Col>
      </Row>
        <Row>
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>NTN #</th>
                <th>GST #</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.customerList).map(key => {
                const row = this.state.customerList[key];
                return <PartyRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
              })}
            </tbody>
          </Table>
        </Row>
        <Row>
        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
            <ModalHeader toggle={this.toggleAddModal}>
              Customer Details
            </ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label for="Customer" sm={3}>
                  Party
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="customer"
                    placeholder="Enter Name"
                    value={this.state.customer}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="address" sm={3}>
                  Address
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={this.state.address}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="contact" sm={3}>
                  Contact
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="contact"
                    placeholder="Enter Phone #"
                    value={this.state.contact}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="email" sm={3}>
                  Email
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    value={this.state.email}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>

                <Label for="ntn" sm={3}>
                  NTN #
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="ntn"
                    placeholder="Enter NTN"
                    value={this.state.ntn}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="gst" sm={3}>
                  GST #
                </Label>
                <Col sm={9}>
                <Input
                  type="text"
                  name="gst"
                  placeholder="Enter GST "
                  value={this.state.gst}
                  onChange={this.handleUserInput}
                />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.myFunction}>{this.state.modalText==="Edit"? "Save":"Add Customer"}</Button>
            </ModalFooter>
          </AvForm>
        </Modal>
      </Row>
    </Page>
    )
  }
}

export default CustomerPage;
