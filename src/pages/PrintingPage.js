import Page from 'components/Page';
import React , { Component } from 'react';
import { FormErrors } from './FormErrors';
import { Col, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import axios from 'axios';
import PrintRow from './PrintRow';

class PrintingPage extends Component {
  convertDate(mydate){
    return( 
      mydate.substring(1,2) === "/" && mydate.substring(3,4) === "/" ?
      mydate.substring(4,8) + "-" + "0" +mydate.substring(0,1) + "-" + "0" + mydate.substring(2,3)
      :
      mydate.substring(1,2) === "/" && mydate.substring(4,5) === "/" ?
      mydate.substring(5,9) + "-" + "0" +mydate.substring(0,1) + "-" + mydate.substring(2,4)
      :
      mydate.substring(2,3) === "/" && mydate.substring(4,5) === "/" ?
      mydate.substring(5,9) + "-"  +mydate.substring(0,2) + "-" + "0"+ mydate.substring(3,4)
      :
      mydate.substring(2,3) === "/" && mydate.substring(5,6) === "/" ?
      mydate.substring(6,10) + "-"  +mydate.substring(0,2) + "-" + mydate.substring(3,5)
      :
      alert('Unreadable date')
  );
    }
    constructor (props) {
      super(props);
      this.state = {
        date: this.convertDate(new Date().toLocaleDateString()),
        id:'',
        printList : [],
        qualityList : [],
        stereoList : [],
        machine: '',
        size: '',
        quality: '',
        color: '',
        weight: '',
        stereo: '',
        frame: '',
        quantity:'',
        formErrors: {printId: '',quality: '',weight: '',color: '',},
        printIdValid: false,
        qualityValid: false,
        weightValid: false,
        colorValid: false,
        formValid: false,
        activeTab : '1',
        tapeList:[],
        bagList:[],
      }
      this.myFunction = this.myFunction.bind(this);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if(name === "size" && this.state.size.length ===1 && value >1)
          value = value + "x";
        this.setState({[name]: value},
                      () => { this.validateField(name, value) });
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let printIdValid = this.state.printIdValid;
        let qualityValid = this.state.qualityValid;
        let weightValid = this.state.weightValid;
        let colorValid = this.state.colorValid;
        let frameValid = this.state.colorValid;
    
        switch(fieldName) {
          case 'printId':
            printIdValid = value.length >= 1;
            break;
          case 'quality':
            qualityValid = value.length >= 1;
            break;
            case 'weight':
            weightValid = value.length >= 1;
            break;
            case 'color':
            colorValid = value.length >= 1;
            case 'frame':
            frameValid = value.length >= 1;
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        printIdValid: printIdValid,
                        qualityValid: qualityValid,
                        weightValid: weightValid,
                        colorValid: colorValid,
                        frameValid: frameValid
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({formValid: this.state.printIdValid && this.state.qualityValid && this.state.colorValid && this.state.weightValid && this.state.frameValid});
      }

      calculateDenier = (bagWeight,widht,length) => {
        console.log(bagWeight+" "+ widht + " " + length)
        return (Math.round(((((parseInt(bagWeight)*9000*39.37)/2)/parseInt(widht)/20)/(parseInt(length)+2))-50))
      }

      myFunction = (event) =>
      {
        event.preventDefault();
        let {size} =this.state;
        if(size.includes("x"))
        size = size.split("x");
        if(size.includes("X"))
        size = size.split("X");
        const width = size[0];
        const length = size[1];
        
        let bagId = this.state.bagList.filter(bag => {
          return bag.quality === this.state.quality &&
            bag.weight === parseInt(this.state.weight) &&
            bag.color === this.state.color &&
            bag.frame === this.state.frame &&
            bag.widht === parseInt(width) &&
            bag.length === parseInt(length)
        })
          let myobject = {
            //Date: this.state.date,
            "machine": this.state.machine,
            "bag_type": bagId[0].id,
            "quantity": this.state.quantity,              
          }
          console.log('You entered: ' + JSON.stringify(myobject, 0, 2));
          //axios.put('http://localhost:8000/app/printing/'+this.state.id+'/',myobject);
      }
      componentDidMount = () => {
        axios.get('http://localhost:8000/app/printing/', this.props.config)
        .then(response => {
            this.setState({printList: response.data});
        });
        axios.get('http://localhost:8000/app/quality/', this.props.config)
        .then(response => {
            this.setState({qualityList: response.data});
        });
        axios.get('http://127.0.0.1:8000/app/bag_type/', this.props.config)
        .then(response => {
          this.setState({bagList: response.data});
        });
        axios.get('http://127.0.0.1:8000/app/stereo/', this.props.config)
        .then(response => {
          this.setState({stereoList: response.data});
        });
      }

      toggleAddModal = () => {
        this.setState(prevState => ({
          addModal: !prevState.addModal,
        }));
      }
      toggle(tab){
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }
      edit = (id,machine,stereo,width,length,quality,color,weight,frame) => {
        console.log(machine);
        let {size} = this.state;
        size = width+"x"+length;
        this.setState({
          addModal: true,
          id:id,
          machine: machine,
          stereo: stereo,
          size: size,
          quality: quality,
          color: color,
          weight: weight,
          frame: frame,
        }) 
      }  

render () {
  return (
    <Page className="header text-center" title="Printing">
        <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>New Batch</Button>
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
                Production
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
                    <th>ID</th>
                    <th>Machine #</th>
                    <th>Stereo</th>
                    <th>Size</th>
                    <th>Quality</th>
                    <th>Color</th>
                    <th>Frame</th>
                    <th>Weight</th>
                    <th># of Bags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.printList).map(key => {
                      const row = this.state.printList[key];
                      return <PrintRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
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
              Change Loom
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
                  <Label for="machine" sm={3}>
                    machine
                  </Label>
                  <Col sm={9}>
                  <Input type="select" name="machine" value = {this.state.machine}
                     onChange={this.handleUserInput} >
                    <option value="">Select machine #</option>
                    {this.state.printList.map(print => <option key = {print.machine}>{print.machine}</option>)}
                    </Input>
                  </Col>
                  </FormGroup>

                  <FormGroup row>
                  <Label for="stereo" sm={3}>
                    Stereo
                  </Label>
                  <Col sm={9}>
                  <Input type="select" name="stereo" value = {this.state.stereo}
                     onChange={this.handleUserInput} >
                    <option value="">Select Stereo</option>
                    {this.state.stereoList.map(stereo => 
                    <option key = {stereo.id}>{stereo.name} ({stereo.width}x{stereo.length})</option>)}
                    </Input>
                  </Col>
                  </FormGroup>

                  <FormGroup row>
                  <Label for="size" sm={3}>
                    Bag Size
                  </Label>
                  <Col sm={9}>
                    <Input type="text" name="size" value = {this.state.size}
                     onChange={this.handleUserInput} placeholder = "Enter Size">
                    </Input>
                  </Col>
                  </FormGroup>

                  <FormGroup row>
                  <Label for="quality" sm={3}>
                    Quality
                  </Label>
                  <Col sm={9}>
                  <Input type="select" name="quality" value = {this.state.quality}
                     onChange={this.handleUserInput} >
                    <option value="">Select Quality</option>
                    {this.state.qualityList.map(quality => <option key = {quality.id}>{quality.name}</option>)}
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
                  <Label for="Weight" sm={3}>
                    Weight
                  </Label>
                  <Col sm={9}>
                  <InputGroup>
                
                  <Input
                      type="text"
                      name="weight"
                      placeholder="Enter Weight "
                      value={this.state.weight}
                      onChange={this.handleUserInput} 
                    />
                    <InputGroupAddon addonType="append">Grams</InputGroupAddon>
                    </InputGroup>
                  </Col>
                  </FormGroup>

                  <FormGroup row>
                  <Label for="frame" sm={3}>
                    Frame
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="frame"
                      placeholder="Enter Frame Color"
                      value={this.state.frame}
                      onChange={this.handleUserInput} 
                    />
                  </Col>
                  </FormGroup>
                  
              </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.myFunction} >Add Batch</Button>
            </ModalFooter>
          </AvForm>
      </Modal>
    </Page>
  )
}
}

export default PrintingPage;
