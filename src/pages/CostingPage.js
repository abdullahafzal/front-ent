import Page from 'components/Page';
import React , { Component } from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { getColor } from 'utils/colors';
import { AvForm } from 'availity-reactstrap-validation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  Row,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;


class CostingPage extends Component {
    constructor (props) {
      super(props);
      this.state = {
        PP: 0,
        RC: 0,
        Calpet: 0,
        ppCost: 227,
        rcCost: 175,
        calpetCost : 95,
        cost: 0,
        ppPercent: 0,
        rcPercent: 0,
        calpetPercent: 0,
      }
    }

    componentDidMount = () => {
      
    };

    handleUserInput = (e) => {
      const name = e.target.name;
      let value = parseInt(e.target.value);
      if(value.toString()==="NaN") value = 0;
      this.setState({[name]: value},
                    () => { this.validateField(name, value) });
      
    }
      
      calculateCost = () => {
        let {PP,RC,Calpet,ppCost,rcCost,calpetCost} = this.state;
        let total = PP+RC+Calpet;
        let cost =100+ ((PP*ppCost)+(RC*rcCost)+(Calpet*calpetCost))/(total)
        let ppPercent = parseInt(100*PP/total)
        let rcPercent = parseInt(100*RC/total)
        let calpetPercent = parseInt(100*Calpet/total)
        this.setState({cost,ppPercent,rcPercent,calpetPercent})
      }
      validateField(fieldName, value) {
        this.calculateCost();
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
    

    addCategory = (event) => {
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
    addItem= (event) => {
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

      handle = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
          <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
          >
            <Handle value={value} {...restProps} />
          </Tooltip>
        );
      }; 

      ppChange = (e) => {
        this.setState({PP:e},
          () => {
            this.calculateCost()
          })   
      }
      rcChange = (e) => {
        this.setState({RC:e},
          () => {
            this.calculateCost()
          })       
      }
      calpetChange = (e) => {
        this.setState({Calpet:e},
          () => {
            this.calculateCost()
          })   
      }

      toggleRatesModal = () => {
        this.setState(prevState => ({
          addModal: !prevState.addModal
        }))
      }

      saveRates = () => {
        this.toggleRatesModal();
      }


render () {
  return (
    
    <Page className="header text-center" title="Costing">
        
      <Row>
        <Col xl={6} lg={8} md={12}>
          <Card>
            <CardHeader className="header text-center">Cost Calculator<Button className="float-right" outline color="secondary" onClick={this.toggleRatesModal}>Rates</Button> </CardHeader>
            <CardBody>
            <FormGroup row>
                <Label for="Customer" sm={2}>
                  <h5>PP</h5>
                </Label>
                <Col sm={8}>
                <Slider 
                    railStyle={{ backgroundColor: '#777777', height: 25 }}
                    trackStyle={{ backgroundColor: '#1d7fcf', height: 25 }}
                    handleStyle={{
                        borderColor: '#777777',
                        height: 40,
                        width: 40,
                        marginLeft: -5,
                        marginTop: -9,
                        backgroundColor: '#1d7fcf',
                    }}
                    min={0} 
                    max={100} 
                    defaultValue={0} 
                    value={this.state.PP}
                    onChange={this.ppChange}
                    handle={this.handle}/>
                </Col>
                <Col sm={2}>
                <Input name="PP" style={{textAlign:"center"}} value={this.state.PP} onChange={this.handleUserInput}/>
                <label>{this.state.ppPercent}%</label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Customer" sm={2}>
                  <h5>RC</h5>
                </Label>
                <Col sm={8}>
                <Slider 
                    railStyle={{ backgroundColor: '#777777', height: 25 }}
                    trackStyle={{ backgroundColor: '#1d7fcf', height: 25 }}
                    handleStyle={{
                        borderColor: '#777777',
                        height: 40,
                        width: 40,
                        marginLeft: -5,
                        marginTop: -9,
                        backgroundColor: '#1d7fcf',
                    }}
                    min={0} 
                    max={100} 
                    defaultValue={0} 
                    value={this.state.RC}
                    onChange={this.rcChange}
                    handle={this.handle}/>
                </Col>
                <Col sm={2}>
                <Input name="RC" style={{textAlign:"center"}} value={this.state.RC} onChange={this.handleUserInput}/>
                <label>{this.state.rcPercent}%</label>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="Customer" sm={2}>
                  <h5>Calpet</h5>
                </Label>
                <Col sm={8}>
                <Slider 
                    railStyle={{ backgroundColor: '#777777', height: 25 }}
                    trackStyle={{ backgroundColor: '#1d7fcf', height: 25 }}
                    handleStyle={{
                        borderColor: '#777777',
                        height: 40,
                        width: 40,
                        marginLeft: -5,
                        marginTop: -9,
                        backgroundColor: '#1d7fcf',
                    }}
                    min={0} 
                    max={100} 
                    defaultValue={0} 
                    value={this.state.Calpet}
                    onChange={this.calpetChange}
                    handle={this.handle}/>
                </Col>
                <Col sm={2}>
                <Input type="text" name="Calpet" style={{textAlign:"center"}} value={this.state.Calpet} onChange={this.handleUserInput}/>
                <label>{this.state.calpetPercent}%</label>
                </Col>
              </FormGroup>

              <div style={{textAlign:"center"}} >
                <Col style={{display:"inline-block"}} lg="5" md="6" sm="8" xs="6" >
                  <Card>
                    <CardHeader className={`text-primary`}>
                      <h5>Cost</h5>
                    </CardHeader>
                    <CardBody>
                      <CardText tag="div" className="justify-content-center text-secondary">
                        <h4>{parseInt(this.state.cost)} Rs</h4>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Modal isOpen={this.state.addModal} toggle={this.toggleRatesModal}>
          <AvForm onValidSubmit={this.add}>
            <ModalHeader toggle={this.toggleRatesModal}>
              Raw Material Rates
            </ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label for="PP" sm={3}>
                  PP
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="ppCost"
                    placeholder="Enter PP Rate"
                    value={this.state.ppCost}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="RC" sm={3}>
                  RC
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="rcCost"
                    placeholder="Enter RC Cost"
                    value={this.state.rcCost}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="calpet" sm={3}>
                  Calpet
                </Label>
                <Col sm={9}>
                  <Input
                    type="text"
                    name="calpetCost"
                    placeholder="Enter Calpet Cost"
                    value={this.state.calpetCost}
                    onChange={this.handleUserInput}
                  />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.saveRates}>Save</Button>
            </ModalFooter>
          </AvForm>
        </Modal>
      </Row>
    </Page>
  )
}
}

export default CostingPage;
