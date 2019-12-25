import Page from 'components/Page';
import React , { Component } from 'react';
import { Col, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { FormErrors } from './FormErrors';
import axios from 'axios';
import SalesRow from './SalesRow';
import classnames from 'classnames';


class SalesPage extends Component {

  convertDate(mydate) {
    return (
      mydate.substring(1, 2) === '/' && mydate.substring(3, 4) === '/' ?
        mydate.substring(4, 8) + '-' + '0' + mydate.substring(0, 1) + '-' + '0' + mydate.substring(2, 3)
        :
        mydate.substring(1, 2) === '/' && mydate.substring(4, 5) === '/' ?
          mydate.substring(5, 9) + '-' + '0' + mydate.substring(0, 1) + '-' + mydate.substring(2, 4)
          :
          mydate.substring(2, 3) === '/' && mydate.substring(4, 5) === '/' ?
            mydate.substring(5, 9) + '-' + mydate.substring(0, 2) + '-' + '0' + mydate.substring(3, 4)
            :
            mydate.substring(2, 3) === '/' && mydate.substring(5, 6) === '/' ?
              mydate.substring(6, 10) + '-' + mydate.substring(0, 2) + '-' + mydate.substring(3, 5)
              :
              alert('Unreadable date')
    );
  }
  rowObject = {
    id:1,
    units:"",
    weight:"",
    quantity:""
  };
  constructor(props) {
    super(props);
    this.state = {
      date: this.convertDate(new Date().toLocaleDateString()),
      customer: '',
      brand: '',
      frame: '',
      size: '',
      quality: '',
      name: '',
      row: [],
      numberOfRows: 0,
      formErrors: { customer: '', brand: '', size: '' },
      customerValid: false,
      brandValid: false,
      sizeValid: false,
      qualityValid: false,
      formValid: false,
      salesList:[],
      customerList:[],
      activeTab: '1',
    };
  }

  componentDidMount = () => {
    axios.get('http://localhost:8000/app/dispatch/', this.props.config)
    .then(response => {
        this.setState({salesList: response.data});
        console.log(this.state.salesList);
    })
    axios.get('http://localhost:8000/app/customer/', this.props.config)
    .then(response => {
        this.setState({customerList: response.data});
    })
  }

  handleQuantityChange = idx => evt => {
    const newquantity = this.state.row.map((quantity, sidx) => {
      if (idx !== sidx) return quantity;
      return { ...quantity, name: evt.target.value };
    });
    this.setState({ quantity: newquantity });
  };

  handleUnitChange = idx => evt => {
    const newunit = this.state.row.map((row, sidx) => {
      if (idx !== sidx) return row;
      return { ...row.unit, name: evt.target.value };
    });
    this.setState({ unit: newunit });
  };

  handleAddRow = (event) => {
    event.preventDefault();
    let newObject = {...this.rowObject};
    newObject.id = this.state.numberOfRows;
    this.setState(prevState=>({
      row:[...prevState.row,newObject],
      numberOfRows: prevState.numberOfRows+1
    }))
  };

  handleRemoveRow = () => {
    let newArray  = [...this.state.row];
    newArray.pop();
    this.setState(
      {
      row:newArray, numberOfRows: this.state.numberOfRows-1
    });
  };

  handleUserInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if(name == "size" && this.state.size.length ==1 && value >1)
      value = value + "x";
    this.setState({ [name]: value },
      () => {
        this.validateField(name, value);
      });
  };

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let customerValid = this.state.customerValid;
    let brandValid = this.state.brandValid;
    let sizeValid = this.state.sizeValid;
    let qualityValid = this.state.qualityValid;

    switch (fieldName) {
      case 'customer':
        customerValid = value.length >= 1;
        break;
      case 'brand':
        brandValid = value.length >= 1;
        break;
      case 'size':
        sizeValid = value.length >= 1;
        break;
      case 'quality':
        qualityValid = value.length >= 1;
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      customerValid: customerValid,
      brandValid: brandValid,
      sizeValid: sizeValid,
      qualityValid: qualityValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.customerValid && this.state.brandValid && this.state.qualityValid && this.state.sizeValid });
  }

  addOrder = (event) => {
    event.preventDefault();
    let myobject = {
      Date: this.state.date,
      Customer: this.state.customer,
      Brand: this.state.brand,
      Frame: this.state.frame,
      Size: this.state.size,
      Quality: this.state.quality,
    };
    alert('You entered: ' + JSON.stringify(myobject, 0, 2));
  }

  printBill = (event) => {
    event.preventDefault();
    let myobject = {
      Date: this.state.date,
      Customer: this.state.customer,
      Brand: this.state.brand,
      Frame: this.state.frame,
      Size: this.state.size,
      Quality: this.state.quality,
      Quantity: this.state.quantity,
    };
    alert('You entered: ' + JSON.stringify(myobject, 0, 2));
  }

  onFieldInput = (event,index) => {
    const target = event.currentTarget;
    console.log(index, event.currentTarget.value, event.currentTarget.name);
    let targetRow = this.state.row[index];
    targetRow[target.name] = target.value;
    this.setState();
  };


  toggleAddModal = () => {
    this.setState(prevState => ({
      addModal: !prevState.addModal,
    }));
  }
  remove = (id) => {
    // this.state.tapeline.map(tapeline => {
    //   if(tapeline.batch_id === id) {
    //     axios.delete('http://localhost:8000/app/tapeline/' + tapeline.id + '/');
    //     console.log("ID : ", tapeline.id)
    //   }
    // })
  }

  edit = (id) => {
    // console.log("BATCH ID: ", id);
    // this.state.tapeline.map(tapeline => {
    //   if(tapeline.batch_id === id) {
        
    //   }
    // })
  }

  toggle(tab){
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }   


  render() {
    return (
      <Page className="header text-center" title="Sales">
         <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>New Sales</Button>
          </Col>
      </Row>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
               onClick={() => { this.toggle('1'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Sales
              </h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
               onClick={() => { this.toggle('2'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Summary
              </h4>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Size</th>
                    <th>Quality</th>
                    <th>Color</th>
                    <th>Frame</th>
                    <th>Weight</th>
                    <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.salesList).map(key => {
                      const row = this.state.salesList[key];
                      return <SalesRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
                    })}
                  </tbody>
                </Table>
              </Row>
              </TabPane>
        </TabContent>
      </div>
       <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
            <ModalHeader toggle={this.toggleAddModal}>
              Add New Batch
            </ModalHeader>
            <ModalBody>
                  <Row form>
                    <Col sm={4}>
                      <FormGroup>
                        <Label for="Date">
                          Date
                        </Label>
                        <Input
                          type="date"
                          name="date"
                          id="date"
                          placeholder="Date"
                          value={this.state.date}
                          onChange={this.handleUserInput}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={8}>
                      <FormGroup>
                        <Label for="Customer">
                          Party
                        </Label>
                        <Input
                          type="text"
                          name="customer"
                          placeholder="Enter Name"
                          value={this.state.customer}
                          onChange={this.handleUserInput}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row form>
                    <Col sm={5}>
                      <FormGroup>
                        <Label for="Brand">
                          Brand
                        </Label>

                        <Input
                          type="text"
                          name="brand"
                          placeholder="Enter Brand/Sterio Name"
                          value={this.state.brand}
                          onChange={this.handleUserInput}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Label for="Quality">
                          Quality
                        </Label>
                        <Input type="select" name="quality" value={this.state.quality}
                               onChange={this.handleUserInput}>
                          <option>1</option>
                          <option>2</option>
                          <option>450</option>
                          <option>Feed</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm={3}>
                      <FormGroup>
                        <Label for="Size">
                          Size
                        </Label>
                        <Input
                          type="text"
                          name="size"
                          placeholder="Enter Size"
                          value={this.state.size}
                          onChange={this.handleUserInput}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Label for="Frame">
                          Frame
                        </Label>
                        <Input
                          type="select"
                          name="frame"
                          value={this.state.frame}
                          onChange={this.handleUserInput}>
                          <option>Red</option>
                          <option>Blue</option>
                          <option>Green</option>
                          <option>Black</option>

                        </Input>
                      </FormGroup>
                    </Col>

                  </Row>

                  <Row>
                    <Col sm={1}>
                      <Label for="#">
                        #
                      </Label>
                    </Col>

                    <Col sm={3}>
                      <Label for="Units">
                        Units
                      </Label>
                    </Col>

                    <Col sm={3}>
                      <Label for="Weight">
                        Weight
                      </Label>
                    </Col>

                    <Col sm={4}>
                      <Label for="Quantity">
                        Quantity
                      </Label>
                    </Col>
                  </Row>

                  {
                    this.state.row.map((r,index) =>{
                      return (
                        <Row key={index}>
                          <div>
                            <Col sm={1}>
                              <Label for="#">
                                {r.id+1}
                              </Label>
                            </Col>
                          </div>

                          <Col sm={3}>
                            <FormGroup>
                              <Input
                                type="text"
                                name='units'
                                placeholder={`Enter Units`}
                                //value={r.units}
                                onChange={(event)=>{this.onFieldInput(event, index)}}
                              />
                            </FormGroup>
                          </Col>

                          <Col sm={3}>
                            <FormGroup>
                              <Input
                                type="text"
                                name='weight'
                                placeholder={`Enter Weight`}
                                //value={r.weight}
                                onChange={(event)=>{this.onFieldInput(event, index)}}
                              />
                            </FormGroup>
                          </Col>
                          <Col sm={3}>
                            <FormGroup>
                              <Input
                                type="text"
                                name='quantity'
                                placeholder={`Enter Quantity`}
                                //value={r.quantity}
                                onChange={(event)=>{this.onFieldInput(event, index)}}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      )
                    })
                  }
                    <Button type="button" onClick={this.handleAddRow}>+</Button>
                    <Button type="button" onClick={this.handleRemoveRow}>-</Button>
              </ModalBody>

              <ModalFooter>
              <Button type="submit" className="justify-content-center" onClick={this.printBill} disabled={!this.state.formValid}>Print Bill</Button>
                <Button type="submit" onClick={this.myFunction} disabled={!this.state.formValid}>Add Batch</Button>
              </ModalFooter>
            </AvForm>
          </Modal>
      </Page>
    )
  }
}

export default SalesPage;