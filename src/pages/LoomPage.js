import Page from 'components/Page';
import React , { Component } from 'react';
import { FormErrors } from './FormErrors';
import { Col,   Card,
  CardBody,
  CardText,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,ButtonGroup, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import axios from 'axios';
import LoomRow from './LoomRow';
import LoomPro from './LoomPro';
import { IconWidget, NumberWidget } from 'components/Widget';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class LoomPage extends Component {
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
        loom_meter_denom : 1.05,
        rSelected: 1,
        total_meters: '',
        rpmreadings: [],
        current_state: [],
        loomRpms : [],
        date_time:this.convertDate(new Date()),
        date: this.convertDate(new Date()).substring(8,10)+
        this.convertDate(new Date()).substring(4,7)+"-"+
        this.convertDate(new Date()).substring(0,4),
        time: this.convertDate(new Date()).substring(11,19),
        id:'',
        loomList : [],
        joinedList: [],
        sortedList:[],
        qualityList : [],
        loomNum: '',
        size: '',
        quality: '',
        color: '',
        weight: 0,
        frame: '',
        formErrors: {loomNum: '',quality: '',weight: '',color: '',},
        loomNumValid: false,
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
        let loomNumValid = this.state.loomNumValid;
        let qualityValid = this.state.qualityValid;
        let weightValid = this.state.weightValid;
        let colorValid = this.state.colorValid;
        let frameValid = this.state.colorValid;
    
        switch(fieldName) {
          case 'loomNum':
            loomNumValid = value.length >= 1;
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
                        loomNumValid: loomNumValid,
                        qualityValid: qualityValid,
                        weightValid: weightValid,
                        colorValid: colorValid,
                        frameValid: frameValid
                      }, this.validateForm);
      }
    
      validateForm() {
        this.setState({formValid: this.state.loomNumValid && this.state.qualityValid && this.state.colorValid && this.state.weightValid && this.state.frameValid});
      }

      calculateDenier = (bagWeight,widht,length) => {
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
        const widht = size[0];
        const length = size[1];
        const Denier = this.calculateDenier(parseInt(this.state.weight),parseInt(widht),parseInt(length));
        let tapeId = this.state.tapeList.filter(tape => {
          
          return tape.quality == this.state.quality && 
            parseInt(tape.denier) > parseInt(Denier) - 25  &&
            parseInt(tape.denier) < parseInt(Denier) + 25 &&
            tape.color === this.state.color
        })
        let bagId = this.state.bagList.filter(bag => {
          
          return bag.quality === this.state.quality &&
            bag.weight === parseInt(this.state.weight) &&
            bag.color == this.state.color &&
            bag.frame == this.state.frame
        })
        
          let myobject = {
              //Date: this.state.date,
              "loom_number": this.state.loomNum,
              "circumference" : this.state.loomList[this.state.id].circumference,
              "tape_type": tapeId[0].id,
              "bag_type": {
                "quality": this.state.quality,
                "width": widht,
                "length": length,
                "frame": this.state.frame,
                "color": this.state.color,
                "weight": this.state.weight
            },
            "quantity": 0,
            "date_time": this.state.date_time
          }
          axios.put('http://localhost:8000/app/loom/'+this.state.id+'/',myobject, this.props.config);
      }

      calculateMeters = (loomRpms) => {
        console.log(loomRpms);
      }

      calculateProduction = () => {
        axios.get('http://localhost:8000/app/loom/', this.props.config)
        .then(response => {
        
          this.setState({loomList: response.data})
          axios.get('http://localhost:8000/app/rpm_reading/?last_values=1', this.props.config)
          .then(response => {
              let latestRpm = response.data
              this.calculateMeters(latestRpm);
              let {loomRpms} = this.state;
              loomRpms = []; 
              latestRpm.map(latestRpm => {
                this.state.loomList.map(loom => {
                  if(latestRpm.loom == loom.id)
                  {
                    latestRpm = {...loom, ...latestRpm}
                    loomRpms.push(latestRpm);
                  }
                })
              })
              loomRpms = loomRpms.sort((a,b) => (a.loom_number >b.loom_number) ? 1 : -1)
              this.setState({loomRpms})
          })
        });  
      }

      

      calculateLooms = () => {
        this.calculateProduction();
        axios.get('http://localhost:8000/app/loom/', this.props.config)
        .then(response => {
          this.setState({loomList: response.data})
          axios.get('http://localhost:8000/app/rpm_reading/?last_values=1', this.props.config)
          .then(response => {             
              let latestRpm = response.data
              let {joinedList} = this.state;
              joinedList = []
              latestRpm.map(latestRpm => {
                this.state.loomList.map(loom => {
                  if(latestRpm.loom == loom.id)
                  {
                    latestRpm = {...loom, ...latestRpm}
                    joinedList.push(latestRpm);
                  }
                })
              })
              joinedList = joinedList.sort((a,b) => (a.loom_number >b.loom_number) ? 1 : -1)
              if(joinedList.length==15){
                this.setState({joinedList})
              }
          })
        });        
      }

      componentDidMount = () => { 
        this.calculateLooms();  
        setInterval(() => { this.calculateLooms() }, 3000   );

        

        axios.get('http://localhost:8000/app/quality/', this.props.config)
        .then(response => {
            this.setState({qualityList: response.data});
        });
        axios.get('http://localhost:8000/app/tape_type/', this.props.config)
        .then(response => {
          this.setState({tapeList: response.data});
        });
        axios.get('http://127.0.0.1:8000/app/bag_type/', this.props.config)
        .then(response => {
          this.setState({bagList: response.data});
        });
      }

      openProductionModal = (loom) => {
        this.setState(prevState => ({
          progressModal: !prevState.progressModal,
        }));
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
        tab === '1' ? this.setState({rSelected: 1}): this.setState({rSelected : 60})

      }
      
      edit = (id,loom,width,length,quality,color,weight,frame) => {
        let {size} = this.state;
        size = width+"x"+length;
        this.setState({
          addModal: true,
          id:id,
          loomNum: loom,
          size: size,
          quality: quality,
          color: color,
          weight: weight,
          frame: frame,
        })
      }  


render () {
  return (
    <Page className="header text-center" title="Looms">
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
               onClick={() => { this.toggle('1'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Looms
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
                    <th>State</th>
                    <th>Loom #</th>
                    <th>Size</th>
                    <th>Quality</th>
                    <th>Color</th>
                    <th>Frame</th>
                    <th>Weight</th>
                    <th>RPM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.joinedList).map(key => {
                      const row = this.state.joinedList[key];
                      return <LoomRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} />
                    })}
                  </tbody>
                </Table>
              </Row>
              </TabPane>
              <TabPane tabId="2">
              <Row>
              <Col lg="3" md="6" sm="8" xs="6">
                <Card>
                  <CardHeader className={`text-primary`}>
                    <h5>Total Meters</h5>
                  </CardHeader>
                  <CardBody>
                    <CardText tag="div" className="justify-content-center text-secondary">
                      <h4>{this.state.total_meters} meters</h4>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={5} md={6} sm={6} xs={12}></Col>
                <ButtonGroup>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.setState({ rSelected: 1, loom_meter_denom:0.0175 });
                      this.calculateLooms();
                      }}
                    active={this.state.rSelected === 1}
                  >
                    Minute
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.setState({ rSelected: 60,  loom_meter_denom:1.05 });
                      this.calculateLooms();
                      }}
                    active={this.state.rSelected === 60}
                  >
                    Hour
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.setState({ rSelected: 1440, loom_meter_denom:25.2  });
                      this.calculateLooms();
                      }}
                    active={this.state.rSelected === 1440}
                  >
                    Day
                  </Button>
                </ButtonGroup>
              </Row>
                <Row>
                    {Object.keys(this.state.loomRpms).map(key => {
                      const meter = this.state.loomRpms[key];
                      meter.loom_meter_denom = this.state.loom_meter_denom;
                      return <LoomPro key={key} id={key} {...meter} openProductionModal={this.openProductionModal} />
                    })}
                </Row>
              </TabPane>
        </TabContent>
        
      </div>
    <Modal isOpen={this.state.progressModal} toggle={this.openProductionModal}>
            <ModalHeader toggle={this.openProductionModal}>
              Loom Details
            </ModalHeader>
          <ModalBody>
            <FormErrors formErrors={this.state.formErrors} />
                <FormGroup row>
                  <Label for="Date" sm={3}>
                      Loom #
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="date"
                      id="date"
                      value = {this.state.date_time.substring(8,10)+
                        this.state.date_time.substring(4,7)+"-"+
                        this.state.date_time.substring(0,4)}
                      onChange={this.handleUserInput} 
                    />
                  </Col>
                  </FormGroup>
              </ModalBody>
      </Modal>

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
                      type="text"
                      name="date"
                      id="date"
                      value = {this.state.date_time.substring(8,10)+
                        this.state.date_time.substring(4,7)+"-"+
                        this.state.date_time.substring(0,4)}
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
                
                  <Label for="loomNum" sm={3}>
                    Loom #
                  </Label>
                  <Col sm={9}>
                  <Input type="input" name="loomNum" value = {this.state.loomNum} readOnly></Input>
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
              <Button type="submit" onClick={this.myFunction} >Change Loom</Button>
            </ModalFooter>
          </AvForm>
      </Modal>
    </Page>
  )
}
}

export default LoomPage;
