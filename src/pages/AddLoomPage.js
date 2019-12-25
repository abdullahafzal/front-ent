import Page from 'components/Page';
import React , { Component } from 'react';
import { FormErrors } from './FormErrors';
import { Col, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import axios from 'axios';
import AddLoomRow from './AddLoomRow';

class AddLoomPage extends Component {

    constructor (props) {
      super(props);
      this.state = {
        date_time:this.convertDate(new Date()),
        loomList : [],
        tapeList:[],
        qualityList:[],
        loomNum: '',
        circumference: '',
        formErrors: {loomNum: '',circumference: '',weight: '',color: '',},
        loomNumValid: false,
        circumferenceValid: false,
        formValid: false,
        addModal: false,
        modalText: '',
      }
      this.myFunction = this.myFunction.bind(this);
    }
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

    handleUserInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value},
                      () => { this.validateField(name, value) });
      }
    
      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let loomNumValid = this.state.loomNumValid;
        let circumferenceValid = this.state.circumferenceValid;
    
        switch(fieldName) {
          case 'loomNum':
            loomNumValid = value.length >= 1;
            break;
          case 'circumference':
            circumferenceValid = value.length >= 1;
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        loomNumValid: loomNumValid,
                        circumferenceValid: circumferenceValid,
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({formValid: this.state.loomNumValid && this.state.circumferenceValid});
      }
      componentDidMount = () => {
        axios.get('http://localhost:8000/app/loom/')
        .then(response => {
            this.setState({loomList: response.data});
        })
        axios.get('http://localhost:8000/app/tape_type/')
        .then(response => {
          this.setState({tapeList: response.data});
      })
      axios.get('http://localhost:8000/app/quality/')
        .then(response => {
          this.setState({qualityList: response.data});
      })
      }

      myFunction(event)
      {
          event.preventDefault();
          let myobject = {
              "loom_number": parseInt(this.state.loomNum),
              "circumference": this.state.circumference,
              "tape_type": this.state.tapeList[0].id,
              "bag_type": {
                "quality": this.state.qualityList[0].id,
                "width": 1,
                "length": 1,
                "frame": "NA",
                "color": "NA",
                "weight": 1
            },
            "quantity": 0,
            "date_time": this.state.date_time,
          }
          let loom = this.state.loomList.filter(loom =>
            loom.loom_number === parseInt(myobject.Loom_number)
          )
          if(loom.length > 0)
          alert('Loom Number : "' + myobject.Loom_number + '" Already Present \n Please enter a new Loom Number');
          else
          axios.post('http://localhost:8000/app/loom/',myobject)
          .then(function (response) {
            console.log("sucess");
          })
          .catch(function (error) {
            console.log(error);
          });
          console.log(myobject);
      }

      toggleAddModal = () => {
        this.setState(prevState => ({
          addModal: !prevState.addModal,
          modalText : '',
          loomNum : '',
          circumference : '',
        }));
      }

      edit = (loom_id,circumference) => {
        this.setState(prevState => ({
          addModal: !prevState.addModal,
          modalText : "Edit",
          loomNum:loom_id,
          circumference: circumference,
        }));
      }

      remove = (loom_id) => {
        axios.delete('http://localhost:8000/app/loom/' + loom_id+'/');
        console.log("LOOM "+ loom_id)
      }
    
    

render () {
  return (
    <Page className="header text-center" title="Looms List">
       <Row>
          <Col>
            <Button className="float-right" outline color="secondary" onClick={this.toggleAddModal}>New Loom</Button>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
              <th>Loom #</th>
              <th>Circumference</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.loomList).map(key => {
                const row = this.state.loomList[key];
                return <AddLoomRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
              })}
            </tbody>
          </Table>
        </Row>
        <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
            <ModalHeader toggle={this.toggleAddModal}>
              {this.state.modalText==="Edit"? "Edit" : "Add New Loom"}
            </ModalHeader>
          <ModalBody>
            <FormErrors formErrors={this.state.formErrors} />
              <Form>
                <FormGroup row>
                  <Label for="loomNum" sm={3}>
                    Loom #
                  </Label>
                  <Col sm={9}>
                    <Input type="text" name="loomNum" value = {this.state.loomNum}
                      onChange={this.handleUserInput}  disabled = {this.state.modalText==="Edit"? true : false} placeholder = "Enter Loom #">
                      </Input>
                  </Col>
                </FormGroup>

                  <FormGroup row>
                  
                  <Label for="circumference" sm={3}>Circumference</Label>
                  <Col sm={9}>
                  <Input type="text" name="circumference" value = {this.state.circumference}
                     onChange={this.handleUserInput} laceholder = "Enter Circumference">
                    </Input>
                  </Col>
                  </FormGroup>
              </Form>
              </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.myFunction} disabled={!this.state.formValid}>Change Loom</Button>
            </ModalFooter>
          </AvForm>
      </Modal>
    </Page>
  )
}
}

export default AddLoomPage;
