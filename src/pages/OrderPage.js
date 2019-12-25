import Page from 'components/Page';
import React , { Component } from 'react';
import axios from 'axios';
import {FormErrors} from './FormErrors';
import { Col, Row, Table,Form,FormGroup,Input, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import OrderRow from './OrderRow';
import Calendar from 'react-calendar';


class OrderPage extends Component {
  convertDate(mydate){
    let returnDate="";
    returnDate+=mydate.toString().substring(11,15); //Year
    switch(mydate.toString().substring(4,7)) { //Month
        case "Jan" :
        returnDate+="-01-"
        break
        case "Feb" :
        returnDate+="-02-"
        break
        case "Mar" :
        returnDate+="-03-"
        break
        case "Apr" :
        returnDate+="-04-"
        break
        case "May" :
        returnDate+="-05-"
        break
        case "Jun" :
        returnDate+="-06-"
        break
        case "Jul" :
        returnDate+="-07-"
        break
        case "Aug" :
        returnDate+="-08-"
        break
        case "Sep" :
        returnDate+="-09-"
        break
        case "Oct" :
        returnDate+="-10-"
        break
        case "Nov" :
        returnDate+="-11-"
        break
        case "Dec" :
        returnDate+="-12-"
        break
    }
    returnDate+=mydate.toString().substring(8,10) + "T" + mydate.toString().substring(16,22)+"00"+"Z"; //Date And Time
    return returnDate
    }
  constructor (props) {
    super(props);
    this.state = {
      orderList: [],
      customerList: [],
      date_time:this.convertDate(new Date()),
      date: this.convertDate(new Date()).substring(8,10)+
      this.convertDate(new Date()).substring(4,7)+"-"+
      this.convertDate(new Date()).substring(0,4),
      time: this.convertDate(new Date()).substring(11,19),
      customer: '',
      stereo: '',
      frame: '',
      size: '',
      color: '',
      quality: '',
      quantity: '',
      formErrors: {customer: '',stereo: '',size: '',quantity: '',},
      sizeValid: false,
      quantityValid: false,
      formValid: false,
      customersList: [],
      stereoList: [],
      qualityList:[],
      str:'',
      customerFilter:'',
      sizeFilter:'',
      stereoFilter:'',
      sizeList: [],
      filteredOrders:[],
    }
  }
  componentDidMount = () => {
    axios.get('http://localhost:8000/app/customer/', this.props.config)
    .then(response => {
        this.setState({customerList: response.data});
    })
    axios.get('http://localhost:8000/app/stereo/', this.props.config)
    .then(response => {
        this.setState({stereoList: response.data});
    })
    axios.get('http://localhost:8000/app/quality/', this.props.config)
    .then(response => {
        this.setState({qualityList: response.data});
    })
    axios.get('http://localhost:8000/app/order/', this.props.config)
    .then(response => {
        let sizeList = response.data.map(orderList => orderList.bag_type.width + "x"+ orderList.bag_type.length)
        this.setState({
          orderList: response.data, 
          sizeList: sizeList, 
          filteredOrders: response.data
        });
    })
  }

handleUserInput = (e) => {
  e.preventDefault();
  const name = e.target.name;
  let value = e.target.value;
  if(name == "size" && this.state.size.length ==1 && value >1)
      value = value + "x";
  this.setState({[name]: value},
                () => { this.validateField(name, value)
                if(name==='time') {
                  let {date_time} = this.state;
                  date_time = date_time.toString().replace(/[T](\d{2})([:])(\d{2})/g,"T"+this.state.time.substring(0,5))
                  this.setState({date_time})
                }});
  if(e.target.name==="category"){
                  this.filterItem(value);
                  console.log("error", value);
                }
}
validateField(fieldName, value) {
  let fieldValidationErrors = this.state.formErrors;
  let sizeValid = this.state.sizeValid;
  let quantityValid = this.state.quantityValid;

  switch(fieldName) {
      case 'size':
      sizeValid = value.length >= 1;
      break;
      case 'quantity':
      quantityValid = value.length >= 1;
      break;
    default:
      break;
  }
  this.setState({formErrors: fieldValidationErrors,
                  sizeValid: sizeValid,
                  quantityValid: quantityValid
                }, this.validateForm);
}

validateForm() {
  this.setState({formValid: this.state.quantityValid && this.state.sizeValid});
}


filterList = (e) => {
  const name = e.target.name;
  let value = e.target.value;
  if(name === "customerFilter" ||name === "sizeFilter")
    {
      let {orderList} = this.state;
      let {filteredOrders} =this.state;
      switch(name) {
      case "customerFilter" :
        filteredOrders = orderList.filter(orders => orders.customer_name===value  )
        this.setState({sizeFilter:''});
        break;
      case "sizeFilter" :
        filteredOrders = orderList.filter(orders => orders.bag_type.width + "x" + orders.bag_type.length===value  )
        this.setState({customerFilter:''});
          break;
      default:          
      }
      this.setState({filteredOrders});
    }
    
  
  this.setState({[name]: value});
}

clearFilter = () => {
  this.setState({customerFilter:'',sizeFilter:'', filteredOrders:this.state.orderList})
}

myFunction = (event) =>
{
    event.preventDefault();
    let myobject =
    {
      "date_time": this.state.date_time,
      "customer": this.state.customer,
      "stereo": this.state.stereo,
      "bag_type": {
          "width": this.state.size.substring(0,2),
          "length": this.state.size.substring(3,5),
          "frame": this.state.frame,
          "color": this.state.color,
          "quality": this.state.quality
      },
      "quantity": this.state.quantity,
  }
    axios.post('http://localhost:8000/app/order/', myobject, this.props.config)
.then(function (response) {
console.log("Added Order");

})
.catch(function (error) {
console.log(error);
});
this.setState(prevState => ({
  addModal: !prevState.addModal,
}));
}


toggleAddModal = () => {
  this.setState(prevState => ({
    addModal: !prevState.addModal,
  }));
}

add = (event, {id, ...rest}) => {
  this.setState(prevState => {
    // you shouldn't mutate, this is just an example.
    prevState.customerList[id] = rest;
    return {...prevState, addModal: false};
  });
}

edit = (id, values) => {
  let con = 'http://localhost:8000/app/order/';
con=con.concat(id,'/');
console.log("String = ",con);
axios.put(con,values);
  this.setState(prevState => {
    return prevState;
  });
}

remove = (id) => {
this.deleteInventory(id);
let con = 'http://localhost:8000/app/order/';
con=con.concat(id,'/');
console.log("String = ",con);
axios.delete(con);
let {orderList} = this.state;
console.log(orderList);
orderList = orderList.filter(order => order.id!==id);
console.log(orderList);
this.setState({orderList});

}

dayClick =(value) => {
  let {filteredOrders} = this.state;
  filteredOrders = filteredOrders.filter(order => parseInt(order.date.substring(0,2))=== parseInt(value.getDate()) && parseInt(order.date.substring(3,5))=== parseInt(value.getMonth()));
  this.setState({filteredOrders})
}

weekClick = (week, date) => {
  console.log(week);
  let {filteredOrders} = this.state;
  filteredOrders = filteredOrders.filter(order => this.getWeekNum(order.date).toString() === week.toString());
  this.setState({filteredOrders})
}

getWeekNum = (d) => {
  var mydate = new Date(d.substring(3,5)+"/"+d.substring(0,2)+"/"+d.substring(6,10));
  return mydate.getWeek(); 
}

monthClick = (value) => {
  let {filteredOrders} = this.state;
  filteredOrders = filteredOrders.filter(order => parseInt(order.date.substring(3,5))=== parseInt(value));
  this.setState({filteredOrders})
}



checkId = (value) => {
  return !this.state.customerList[value] || 'That Customer ID already exists, please edit the existing row or pick another one.'
}


render() {
  return (
    <Page
      title="All Orders"
      className="TablePage"
    >
       <div>
        <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>Add</Button>
          </Col>
        </Row>
        <Row>
        <Col sm={3}>
          <Calendar 
          onClickDay={(value)=>this.dayClick(value) }
          onClickWeekNumber = {(weekNumber, date) => this.weekClick(weekNumber, date)}
          onClickMonth = {(value)=>this.monthClick(value.getMonth())}
          showWeekNumbers={true}
          view={"month"}
          />
        </Col>
        
        <Col sm={4} style={{alignItems:"center"}}>
          <Row>
            <Label sm={12} style={{textAlign:"left"}}>
              Filters:
            </Label>
          </Row>
          <Row>
            <Col sm={9}>
              <Input type="select" name="customerFilter" value = {this.state.customerFilter}
                  onChange={this.filterList} >
                  <option disabled value="">Filter By Customer</option>
                  {this.state.customerList.map(customer => <option key = {customer.id}>{customer.name}</option>)}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Input type="select" name="sizeFilter" value = {this.state.sizeFilter}
                  onChange={this.filterList} >
                  <option disabled value="">Filter By Size</option>
                  {this.state.sizeList.map(size => <option key = {size}>{size}</option>)}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Button className="float-right" color="primary" onClick={this.clearFilter}>Clear</Button>
            </Col>
          </Row>
        </Col>
      </Row>
        <Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
              <th>#</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Stereo</th>
              <th>Size</th>
              <th>Color</th>
              <th>Quality</th>
              <th>Frame</th>
              <th>No. of Bags</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.filteredOrders).map(key => {
                const row = this.state.filteredOrders[key];
                return <OrderRow key={key} id={key} {...row} edit={this.edit} remove={this.remove} />
              })}
            </tbody>
          </Table>
        </Row>
        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
          <ModalHeader toggle={this.toggleAddModal}>
            New Order
          </ModalHeader>
          <ModalBody>
          <FormErrors formErrors={this.state.formErrors} />
              <Row form>
              <Col sm={6}>
                  <FormGroup>
                  <Label for="Date">
                      Date
                  </Label>
                  <Input
                    type="text"
                    name="date"
                    id="date"
                    placeholder="date"
                    value = {this.state.date_time.substring(8,10)+
                      this.state.date_time.substring(4,7)+"-"+
                      this.state.date_time.substring(0,4)}
                    onChange={this.handleUserInput}
                  />
                  </FormGroup>
                  </Col>
                  <Col sm={6}>
                  <FormGroup>
                  <Label for="Time">
                      Time
                  </Label>
                  <Input
                    type="time"
                    name="time"
                    id="time"
                    value = {this.state.time}
                    onChange={this.handleUserInput}
                  />
                  </FormGroup>
                  </Col>
                </Row>
                <Row form>
                <Col sm={6}>
                  <Label for="Customer">
                    Party
                  </Label>
                  <Input 
                      type="select"
                      name="customer"
                      value={this.state.customer}
                      onChange={e => this.handleUserInput(e)} >
                        <option value={-1} disabled selected>Select Customer</option>
                        {this.state.customersList.map(customer => <option value={customer.id} key ={customer.id}>{customer.name}</option>)}
                      </Input>
                  </Col>
                  <Col sm={6}>
                  <Label for="stereo">
                    Stereo
                  </Label>
                    <Input
                      type="select"
                      name="stereo"
                      value={this.state.stereo}
                      onChange={this.handleUserInput}>
                        <option value="" disabled selected>Select Stereo</option>
                        {this.state.stereoList.map(stereo => <option value={stereo.id} key ={stereo.id}>{this.state.str.concat(stereo.name," ",stereo.width,"x",stereo.length)}</option>)}
                        </Input>
                  </Col>
                </Row>
                <FormGroup row>
                </FormGroup>
                <Row form>
                <Col sm={4}>
                  <Label for="Quality">
                    Quality
                  </Label>
                    <Input type="select" name="quality" value={this.state.quality}
                   onChange={this.handleUserInput} >
                     <option value="" disabled selected>Select Quality</option>
                   {this.state.qualityList.map(quality => <option value={quality.id} key={quality.id}>{quality.name}</option>)}
                    </Input>
                  </Col>
                <Col sm={4}>
                  <Label for="Color">
                    Color
                  </Label>
                    <Input type="text" name="color" value={this.state.color}
                    onChange={this.handleUserInput} placeholder="Bag Color" >
                    </Input>
                  </Col>
                  <Col sm={4}>
                  <Label for="Frame">
                    Frame
                  </Label>
                    <Input 
                    type="text"
                     name="frame"
                     value={this.state.frame}
                     placeholder="Frame Color"
                     onChange={this.handleUserInput} />
                  </Col>

                  </Row>
                  <FormGroup row>
                </FormGroup>
                  <Row form>
                  <Col sm={5}>
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
                  </Col>
                  <Col sm={2}></Col>
                  <Col sm={5}>
                  <Label for="Quantity">
                    No. of Bags
                  </Label>
                    <Input
                      type="text"
                      name="quantity"
                      placeholder="Enter Quantity "
                      value={this.state.quantity}
                      onChange={this.handleUserInput} 
                    />
                  </Col>
                </Row>
          </ModalBody>
          <ModalFooter>
          <Button type="submit" onClick={this.myFunction} disabled={!this.state.formValid}>Add Order</Button>
          </ModalFooter>
          </AvForm>
        </Modal>
      </div>
    </Page>
  );
};
}

export default OrderPage;
