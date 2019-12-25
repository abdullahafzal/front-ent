import Page from 'components/Page';
import React , { Component } from 'react';
import { FormErrors } from './FormErrors';
import axios from 'axios';
import { Col, Row, Table,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import PurchaseRow from './PurchaseRow';

class PurchasePage extends Component {

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
  convertTime(mydate) {
    var time = mydate.toString().substring(16,21);
    return time
  }

    constructor (props) {
      super(props);
      this.state = {
        date: this.convertDate(new Date().toLocaleDateString()),
        time: this.convertTime(new Date()),
        supplier: '',
        category: '',
        item: '',
        unit: '',
        quantity: '',
        amount: '',
        comments: '',
        formErrors: {supplier: '',item: '',quantity: '',unit: '', amount: '',},
        supplierValid: false,
        quantityValid: false,
        itemValid: false,
        unitValid: false,
        formValid: false,
        amountValid:false,
        itemList: [],
        categoryList: [],
        filterdList:[],
        inventoryList:[],
        purchaseList:[],
        supplierList:[],
        match : true,
      }
    }

    componentDidMount = () => {
      axios.get('http://localhost:8000/app/suppliers/')
      .then(response => {
          this.setState({supplierList: response.data});
        })
      axios.get('http://localhost:8000/app/item/')
      .then(response => {
          this.setState({itemList: response.data});
        })
      axios.get('http://localhost:8000/app/item_category/')
      .then(response => {
          this.setState({categoryList: response.data});
        })
        axios.get('http://localhost:8000/app/inventory/')
      .then(response => {
          this.setState({inventoryList: response.data});
        })
        this.getPurchase();
  };

   getPurchase = () => {
    axios.get('http://localhost:8000/app/purchase/')
    .then(response => {
        this.setState({purchaseList: response.data});
          })
   }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
                      () => {
                         this.validateField(name, value)});
        if(e.target.name==="category"){
          this.filterItem(value);
          this.setState({item: -1});
          }
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let supplierValid = this.state.supplierValid;
        let quantityValid = this.state.quantityValid;
        let itemValid = this.state.itemValid;
        let unitValid = this.state.unitValid;
        let amountValid = this.state.amountValid;
    
        switch(fieldName) {
          case 'supplier':
              supplierValid = value.length >= 1;
            break;
            case 'quantity':
              quantityValid = value.length >= 1;
            break;
            case 'unit':
              unitValid = value.length >= 1;
            break;
            case 'amount':
              amountValid = value.length >= 1;
            break;
            case 'item' :
              itemValid = this.state.item >= 0;
            break;
            case 'category':
                itemValid = this.state.item >= 0;
                break;
              default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        supplierValid: supplierValid,
                        quantityValid: quantityValid,
                        unitValid: unitValid,
                        amountValid: amountValid,
                        itemValid: itemValid
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({formValid: this.state.supplierValid && this.state.unitValid && this.state.quantityValid && this.state.amountValid && this.state.itemValid});
        //console.log(this.state.supplierValid +"  "+ this.state.unitValid +" "+ this.state.quantityValid +"  "+ this.state.amountValid +"   "+ this.state.itemValid)
      }
   
      filterItem = (value) =>
      {
        let {filterdList} = this.state;
        filterdList= this.state.itemList.filter(item => item.category == value);
        this.setState({filterdList});
      }


      myFunction = (event) => { 
        event.preventDefault();
        let myobject = {
          "date_time": this.state.date.toString() + "T" + this.state.time.toString() + ":00+05:00",
          "supplier": this.state.supplier,
          "item": this.state.item,
          "unit": this.state.unit,
          "quantity": this.state.quantity,
          "price": this.state.amount,
          "comments": this.state.comments,
        }
        console.log(myobject);
        axios.post('http://127.0.0.1:8000/app/purchase/', myobject)
        .then(response=> {
          this.getPurchase();
          this.toggleAddModal();
        })
      }

      // addInventory = () =>
      // { 
      //   let {inventoryList}=this.state;
      //   let {match}=this.state;
      //   const {item}=this.state;
      //   let inventoryEntry = 
      //     {
      //       "item": this.state.item,
      //       "unit": this.state.quantity,
      //       "price": this.state.amount,
      //     }
      //   for(let i in inventoryList){
      //     if(item==inventoryList[i].item){
      //         inventoryEntry.unit = parseInt(inventoryEntry.unit) + parseInt(inventoryList[i].unit);
      //         inventoryEntry.price = parseInt(inventoryEntry.price) + parseInt(inventoryList[i].price);
      //         console.log('http://127.0.0.1:8000/app/inventory/' + inventoryList[i].id + '/')
      //         axios.put('http://127.0.0.1:8000/app/inventory/' + inventoryList[i].id + '/', inventoryEntry)
      //         match = false;
      //         this.setState({match: match});
      //        }
      //     }
      //   if(match)
      //     axios.post('http://127.0.0.1:8000/app/inventory/', inventoryEntry);
      //   }

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
        axios.delete('http://localhost:8000/app/purchase/' + id + '/'); 
        let {purchaseList} = this.state;
        let deletedPurchase = purchaseList.filter(purchase => purchase.id==id);
        purchaseList = purchaseList.filter(purchase => purchase.id!==id);
        //let itemId = deletedPurchase[0].item;
        //this.reduceInventory(itemId, deletedPurchase[0].price , deletedPurchase[0].quantity);
        this.setState({purchaseList});
      }
      
      // reduceInventory = (itemId , price, quantity) => {
      //   this.getInventory();
      //   let {inventoryList} = this.state;
      //   inventoryList = inventoryList.filter(inventory => inventory.item===itemId);
      //   let inventoryId = inventoryList[0].id;
      //   price = parseInt(inventoryList[0].price) - parseInt(price);
      //   quantity = parseInt(inventoryList[0].unit) - parseInt(quantity);
      //   let reducedEntry = {
      //     "item": itemId,
      //     "unit": quantity,
      //     "price": price
      //   }
      //   axios.put('http://localhost:8000/app/inventory/' + inventoryId + '/', reducedEntry);
      // }

      // checkId = (value) => {
      //   return !this.state.customerList[value] || 'That Customer ID already exists, please edit the existing row or pick another one.'
      // }
    
    

render () {
  return (
    <Page className="header text-center" title="Purchases">
      <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>Add</Button>
          </Col>
      </Row>
        <Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
              <th>#</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Item</th>
              <th># of Bags</th>
              <th>quantity</th>
              <th>Amount</th>
              <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.purchaseList).map(key => {
                const row = this.state.purchaseList[key];
                return <PurchaseRow key={key} id={key} {...row} edit={this.edit} remove={this.remove} />
              })}
            </tbody>
          </Table>
        </Row>
        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
          <ModalHeader toggle={this.toggleAddModal}>
            New Purchase
          </ModalHeader>
          <ModalBody>
            <FormErrors formErrors={this.state.formErrors} />
                
              <Row form>
                <Col sm={6}>
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
                </Col>
                <Col sm={6}>
                    <Label for="Date">
                        Date
                    </Label>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      value = {this.state.date}
                      onChange={this.handleUserInput} 
                    />
                  </Col>
                </Row>
                <Row form>
                <Col sm={6}>
                  <Label for="Supplier">
                    Supplier
                  </Label>
                    <Input
                      type="select"
                      name="supplier"
                      value={this.state.supplier}
                      onChange={this.handleUserInput} >
                        <option value="">Select Supplier</option>
                      {this.state.supplierList.map(supplier => <option value={supplier.id} key = {supplier.id}>{supplier.name}</option>)}
                      </Input>
                  </Col>
                  <Col sm={3}>
                  <Label for="Category">
                    Category
                  </Label>
                    <Input type="select" name="category" value = {this.state.category}
                     onChange={this.handleUserInput} >
                       <option value="">Select Category</option>
                     {this.state.categoryList.map(category => <option value={category.id} key ={category.id}>{category.name}</option>)}
                 </Input>
                  </Col>
                  <Col sm={3}>
                  <Label for="Item">
                    Item
                  </Label>
                    <Input
                      type="select"
                      name="item"
                      value={this.state.item}
                      onChange={this.handleUserInput}>
                        <option value={-1} >Select Item</option>
                        {this.state.filterdList.map(item =>
                          <option value={item.id} key={item.id} >{item.name}</option>)
                          }
                    </Input>
                  </Col>
                </Row>
                <FormGroup row>
                  
                </FormGroup>
                <Row form>
                <Col sm={4}>
                  <Label for="unit">
                    # of Bags
                  </Label>
                    <Input
                      type="text"
                      name="unit"
                      placeholder="Enter unit "
                      value={this.state.unit}
                      onChange={this.handleUserInput} 
                    />
                  </Col>
                <Col sm={4}>
                  <Label for="quantity">
                    Total quantity
                  </Label>
                  <InputGroup>
                
                  <Input
                      type="text"
                      name="quantity"
                      placeholder="Enter quantity "
                      value={this.state.quantity}
                      onChange={this.handleUserInput} 
                    />
                    <InputGroupAddon addonType="append">KG</InputGroupAddon>
                    </InputGroup>
                  </Col>
                  <Col sm={4}>
                  <Label for="Amount">
                    Amount
                  </Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="amount"
                      placeholder="Enter Amount"
                      value={this.state.amount}
                      onChange={this.handleUserInput} 
                    />
                    <InputGroupAddon addonType="append">RS</InputGroupAddon>
                    </InputGroup>
                  </Col>                  
                </Row>
                <FormGroup row>
                </FormGroup>
                <Row form>
                <Col sm={12}>
                  <Label for="Comment">
                    Comments
                  </Label>
                    <Input
                      type="textarea"
                      name="comments"
                      placeholder="Enter Comments here "
                      value={this.state.comments}
                      onChange={this.handleUserInput}
                    />
                  </Col>
                  </Row>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.myFunction} disabled={!this.state.formValid}>Add Purchase</Button>
            </ModalFooter>
          </AvForm>
        </Modal>
    </Page>
  )
}
}

export default PurchasePage;
