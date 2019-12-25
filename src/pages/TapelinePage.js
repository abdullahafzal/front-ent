import Page from 'components/Page';
import React , { Component } from 'react';
import { Col, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { FormErrors } from './FormErrors';
import axios from 'axios';
import TapelineSumRow from './TapelineSumRow';
import classnames from 'classnames';
import Calendar from 'react-calendar';


class TapelinePage extends Component {
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
        denier: '',
        color: '',
        quality: '',
        item:'',
        category:'',
        numberOfRows: 0,
        row: [],
        filter:[],
        formErrors: {denier: '',quality: '',pp: '',color: '',},
        denierValid: false,
        qualityValid: true,
        ppValid: false,
        colorValid: false,
        formValid: false,
        itemList: [],
        categoryList: [],
        inventoryList:[],
        qualities:[],
        tapeline:[],
        mixId:'',
        filteredList : [],
        activeTab: '1',
        summaryList: [],
        modalText: '',
        inventory : {
          id:1,
          item_category:'',
          item:'',
          itemList:[],
          inventoryId:'',
          quantity:'',
        },
      }
    }

    componentDidMount = () => {
      axios.get('http://localhost:8000/app/item/')
      .then(response => {
          this.setState({itemList: response.data});
      })
      axios.get('http://localhost:8000/app/item_category/')
      .then(response => {
          this.setState({categoryList: response.data});
      })
      axios.get('http://localhost:8000/app/quality/')
      .then(response => {
          this.setState({qualities: response.data});
      })
      axios.get('http://localhost:8000/app/inventory/')
      .then(response => {
          this.setState({inventoryList: response.data});
      })
      .catch(function (error) {
        // handle error
        console.log("suc");
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
      this.getTapeline();   
  };
  getTapeline = () => {
    axios.get('http://localhost:8000/app/tapeline/')
      .then(response => {
          this.setState({tapeline: response.data});
          let {tapeline} = this.state;
          let {mixId} = this.state;
          if(tapeline.length > 0) {
            mixId =  tapeline[tapeline.length-1].batch_id + 1;
            this.getSummary(tapeline);
          }
            else 
              mixId = 1;
          this.setState({mixId:mixId});
      })
  }
  getSummary = (tapeline) => {
    let {summaryList} = this.state;
    let batchId = '-1';
    tapeline.map(tapeline => {
      if(tapeline.batch_id === batchId) {
        summaryList[summaryList.length-1] = {
          "id" : summaryList[summaryList.length-1].id,
          "batch_id" : batchId,
          "inventory" : summaryList[summaryList.length-1].inventory,
          "quantity" : parseInt(summaryList[summaryList.length-1].quantity) + parseInt(tapeline.quantity),
          "tape_type" : summaryList[summaryList.length-1].tape_type,
          "date_time" : tapeline.date_time,
        }
        summaryList[summaryList.length-1].inventory.push(tapeline.item_name + " "+ tapeline.item_category + " : \xa0" + tapeline.quantity + " ");
      } else {
          batchId = parseInt(tapeline.batch_id);
          tapeline.inventory = [tapeline.item_name + " "+ tapeline.item_category + " : \xa0" + tapeline.quantity + " "];
          summaryList.push(tapeline);
      }
    })
    this.setState({summaryList}, () => {
      this.setState({filteredList: summaryList})
    });
    console.log("Hellloo" + summaryList)
  }

  handleAddRow = (event) => {
    event.preventDefault();
    let newObject = {...this.state.inventory};
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
  onFieldInput(event,index){
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    let targetRow = this.state.row;
    let {inventoryList} = this.state;
    if(name == 'quantity')
      targetRow[index].quantity = value;
    if(name == 'item') {
      targetRow[index].item = value;
      targetRow[index].inventoryId = inventoryList.filter(inventory => inventory.item == value)[0].id;
    }
    if(name == 'item_category'){
      console.log(this.filterAvailableItems(value));
      targetRow[index].item_category = value;
      targetRow[index].itemList = this.filterAvailableItems(value);
    }
    this.setState({row:targetRow});    
  };

  filterAvailableItems(value)
      {
        const {itemList} = this.state; 
        let availableItems = [];
        this.state.inventoryList.map(inventory => {

          const temp = itemList.filter(item => item.id == inventory.item && item.category == value)
            availableItems.push(inventory)
        });
        console.log(availableItems);
        return availableItems
      }

    handleUserInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value},
                      () => { this.validateField(name, value) 
                      
                      });
                                    
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let denierValid = this.state.denierValid;
        let qualityValid = this.state.qualityValid;
        let ppValid = this.state.ppValid;
        let calpetValid = this.state.calpetValid;
        let rcValid = this.state.rcValid;
        let colorkgValid = this.state.colorkgValid;
        let colorValid = this.state.colorValid;
    
        switch(fieldName) {
          case 'denier':
            denierValid = value.length >= 1;
            break;
          case 'quality':
            qualityValid = value.length >= 1;
            break;
            case 'pp':
            ppValid = value.length >= 0;
            break;
            case 'calpet':
            calpetValid = value.length >= 0;
            break;
            case 'rc':
            rcValid = value.length >= 0;
            break;
            case 'colorkg':
            colorkgValid = value.length >= 0;
            break;
            case 'color':
            colorValid = value.length >= 1;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        denierValid: denierValid,
                        qualityValid: qualityValid,
                        ppValid: ppValid,
                        rcValid: rcValid,
                        calpetValid: calpetValid,
                        colorkgValid: colorkgValid,
                        colorValid: colorValid,
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({formValid: this.state.denierValid && this.state.qualityValid && this.state.colorValid});
      }

      addTapeline = (event) =>
      {
          event.preventDefault();
          this.state.row.map((r,index) => {
            console.log(index);
            let myobject = {
              "batch_id": this.state.mixId,
              "inventory": r.inventoryId,
              "tape_type": {
                  "quality": this.state.quality,
                  "denier": this.state.denier,
                  "color": this.state.color,
              },
              "quantity": r.quantity,
              "date_time": this.state.date.toString() + "T" + this.state.time.toString() + ":00+05:00",
          }
          console.log('You entered: ' + JSON.stringify(myobject, 0, 2));
          setTimeout(this.postTapeline, index*50 ,myobject);
          })
      }

      editTapeline = (event) =>
      {
          event.preventDefault();
          this.state.row.map((r,index) => {
            console.log(index);
            let myobject = {
              "batch_id": this.state.mixId,
              "inventory": r.inventoryId,
              "tape_type": {
                  "quality": this.state.quality,
                  "denier": this.state.denier,
                  "color": this.state.color,
              },
              "quantity": r.quantity,
              "date_time": this.state.date.toString() + "T" + this.state.time.toString() + ":00+05:00",
          }
          console.log('You entered: ' + JSON.stringify(myobject, 0, 2));
          setTimeout(this.postTapeline, index*50 ,myobject);
          })
      }

      postTapeline = (myobject) => {
        axios.post('http://localhost:8000/app/tapeline/',myobject, this.props.config)
      }

      toggleAddModal = () => {
        this.setState(prevState => ({
          addModal: !prevState.addModal,
          modalText: "Add New"
        }));
      }
      
      add = (event, {id, ...rest}) => {
        this.setState(prevState => {
          // you shouldn't mutate, this is just an example.
          prevState.tapeline[id] = rest;
          return {...prevState, addModal: false};
          });
      }

      remove = (id) => {
        console.log("BATCH ID: ", id);
        this.state.tapeline.map(tapeline => {
          if(tapeline.batch_id === id) {
            axios.delete('http://localhost:8000/app/tapeline/' + tapeline.id + '/', this.props.config);
            console.log("ID : ", tapeline.id)
          }
        })      
        //window.location.reload();
      }

      edit = (batch_id,inventory,quality,denier,color,quantity,date_time) => {
        console.log("BATCH ID: ", batch_id,inventory,quality,denier,color,quantity,date_time);
        this.setState({
          addModal: true,
          modalText: "Edit",
          mixId:batch_id,
          quality: quality,
          denier: denier,
          color: color,
          quantity: quantity,
          date_time: date_time,
        })
      }

      toggle(tab){
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }
      dayClick =(value) => {
        let filteredList = this.state.summaryList;
        filteredList = filteredList.filter(tape => parseInt(tape.date_time.substring(8,10))=== parseInt(value.getDate()) && parseInt(tape.date_time.substring(5,7))=== parseInt(value.getMonth()+1));
        this.setState({filteredList: filteredList})
      }
      
      weekClick = (week) => {
        let filteredList = this.state.summaryList;
        filteredList = filteredList.filter(tape => this.getWeekNum(tape.date_time).toString() === week.toString());
        this.setState({filteredList: filteredList})
      }
      
      getWeekNum = (d) => {
        var mydate = new Date(d.substring(3,5)+"/"+d.substring(0,2)+"/"+d.substring(6,10));
        return mydate.getWeek(); 
      }
      
      monthClick = (value) => {
        let filteredList = this.state.summaryList;
        filteredList = filteredList.filter(tape => parseInt(tape.date_time.substring(5,7))=== parseInt(value));
        this.setState({filteredList: filteredList})
      }

render () {
  return (
    <Page className="header text-center" title="Tapeline">
      
      <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>Add</Button>
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
                Batches
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
                    <th>Date</th>
                    <th>Batch #</th>
                    <th>Item</th>
                    <th>Quality</th>
                    <th>Denier</th>
                    <th>Color</th>
                    <th>quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.summaryList).map(key => {
                      const row = this.state.summaryList[key];
                      return <TapelineSumRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
                    })}
                  </tbody>
                </Table>
              </Row>
              </TabPane>
        </TabContent>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="2">

            <Row>
              <Col sm={4}>
                <Calendar 
                onClickDay={(value)=>this.dayClick(value) }
                onClickWeekNumber = {(weekNumber, date) => this.weekClick(weekNumber, date)}
                onClickMonth = {(value)=>this.monthClick(parseInt(value.getMonth()+1))}
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
                {/* <Row>
                  <Col sm={9}>
                    <Input type="select" name="customerFilter" value = {this.state.customerFilter}
                        onChange={this.filterList} >
                        <option disabled value="">Filter By Customer</option>
                        {this.state.customerList.map(customer => <option key = {customer.id}>{customer.name}</option>)}
                    </Input>
                  </Col>
                </Row> */}
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
                  <th>Date</th>
                  <th>Batch #</th>
                  <th>Item</th>
                  <th>Quality</th>
                  <th>Denier</th>
                  <th>Color</th>
                  <th>quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.state.filteredList).map(key => {
                    const row = this.state.filteredList[key];
                    return <TapelineSumRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
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
              {this.state.modalText} Batch
            </ModalHeader>
          <ModalBody>
            <FormErrors formErrors={this.state.formErrors} />
            <FormGroup row>
              <Label for="Date" sm={3}>
                  Date
              </Label>
              <Col sm={9}>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value = {this.state.date}
                  onChange={this.handleUserInput} 
                />
              </Col>
          </FormGroup>
          <FormGroup row>
              <Label for="Time" sm={3}>
                  Time
              </Label>
              <Col sm={9}>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  value = {this.state.time}
                  onChange={this.handleUserInput} 
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="denier" sm={3}>
                Denier
              </Label>
              <Col sm={9}>
                <Input type="text" name="denier" value = {this.state.denier}
                  onChange={this.handleUserInput} >
                  </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="color" sm={3}>
                Color
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="color"
                  placeholder="Enter color "
                  value={this.state.color}
                  onChange={this.handleUserInput} 
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="quality" sm={3}>
                Quality
              </Label>
              <Col sm={9}>
                <Input type="select" name="quality" value = {this.state.quality}
                  onChange={this.handleUserInput}>
                  <option value="">Select Quality</option>
                  {this.state.qualities.map(quality => <option key = {quality.id}>{quality.name}</option>)}
                  </Input>
              </Col>
            </FormGroup>
              {
                this.state.row.map((r,index) =>{
                  return (
                    <Row key={index}>
                      <Col sm={3}>
                        <FormGroup>
                          <Input
                            type="select"
                            name='item_category'
                            onChange={(event)=>{this.onFieldInput(event, index)}}>
                              <option value="">Category</option>
                              {this.state.categoryList.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col sm={4}>
                        <FormGroup>
                          <Input
                            type="select"
                            name='item'
                            onChange={(event)=>{this.onFieldInput(event, index)}}>
                              <option value="">Name</option>
                            {this.state.row[index].itemList.map(item =>
                              <option key = {item.item.id} value = {item.item}>{item.item.name}</option>)}                                 
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm={5}>
                        <FormGroup>
                          <InputGroup>
                            <Input
                              type="text"
                              name='quantity'
                              onChange={(event)=>{this.onFieldInput(event, index)}}
                            />
                            <InputGroupAddon addonType="append">KG</InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                )})}
                
              <Row form>
                <Button type="button" onClick={this.handleAddRow}>+</Button>
                <Button type="button" onClick={this.handleRemoveRow}>-</Button>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" onClick={this.state.modalText==="Edit"? this.editTapeline : this.addTapeline} disabled={!this.state.formValid}>{this.state.modalText==="Edit"? "Save" : "Add Batch" }</Button>
            </ModalFooter>
          </AvForm>
        </Modal>
             
    </Page>
  )
}
}
export default TapelinePage;
