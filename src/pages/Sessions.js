import Page from 'components/Page';
import React , { Component } from 'react';
import { Col, Row, Table,Nav, NavItem,NavLink, TabContent, TabPane,Form,FormGroup,Input,Card,CardHeader,CardBody,InputGroup,InputGroupAddon, Button,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import classnames from 'classnames';
import SessionsAvailableRow from './SessionsAvailableRow';
import Calendar from 'react-calendar';

Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

class Sessions extends Component {

    constructor (props) {
      super(props);
      this.state = {
        date:'',
        id:'',
        type: '',
        room: '',
        advisor:'',
        row:[],
        numberOfRows: 3,
        rowEntry: {
          id:'',
          date:'',
          start_time:'',
          end_time:'',
          type: '',
          room: '',
          advisor:'',
        },
        modal_date:'',
        modal_start_time:'',
        modal_end_time:'',
        modal_type:'',
        modal_room:'',
        modal_advisor:'',
        modal_student_id:'',
        modal_student_name:'',
        modal_appointment_for:'',
        modal_assignment_type:'',
        modal_subject_name:'',
        activeTab : '1',
        availableSessionsList: [
          { "id":"1", "date": "10/09/2019", "start_time": "10:00", "end_time": "11:00", "room": "CB01 05 25", "advisor": "James Smith", "type": "UG/PG course work", "student": "Waiz"},
          { "id":"2", "date": "20/08/2019", "start_time": "09:00", "end_time": "10:00", "room": "CB01 10 25", "advisor": "Tory Nile", "type": "UG/PG course work", "student": ""},
          { "id":"3", "date": "15/08/2019", "start_time": "11:00", "end_time": "12:00", "room": "RB01 05 25", "advisor": "Jhon Diggel", "type": "UG/PG course work", "student": "Mark"},
          { "id":"4", "date": "17/09/2019", "start_time": "03:00", "end_time": "04:00", "room": "SB01 05 25", "advisor": "Mohammad Ali", "type": "UG/PG course work", "student": "Stig"},
          { "id":"5", "date": "19/07/2019", "start_time": "04:00", "end_time": "05:00", "room": "QB01 05 25", "advisor": "Nathan Smith", "type": "UG/PG course work", "student": ""},
          { "id":"6", "date": "28/08/2019", "start_time": "05:00", "end_time": "06:00", "room": "NB01 05 25", "advisor": "King", "type": "Online Feedback", "student": ""},
          { "id":"7", "date": "24/07/2019", "start_time": "11:00", "end_time": "07:00", "room": "DB01 05 25", "advisor": "Imran Khan", "type": "Online Feedback", "student": ""},
          { "id":"8", "date": "01/09/2019", "start_time": "01:00", "end_time": "02:00", "room": "AB01 05 25", "advisor": "Donald Trump", "type": "UG/PG course work", "student": ""},
        ],
        toggleSessionList:[],
        filteredSessionList:[],
        availableType: [],
        availableAdvisor: [],
        availableRoom:[],
      }

    }

    getAvailableType = () => {
      const types = this.state.availableSessionsList.map(x => x.type);
      const uniqueTypes = [...new Set(types)];
      this.setState({availableType:uniqueTypes}) 
    }
    getAvailableAdvisor = () => {
      let advisors = this.state.availableSessionsList.map(x => x.advisor);
      const noNullAdvisors = advisors.filter(advisor => advisor!="")
      const uniqueAdvisors = [...new Set(noNullAdvisors)];
      this.setState({availableAdvisor:uniqueAdvisors}) 
    }
    getAvailableRoom = () => {
      const rooms = this.state.availableSessionsList.map(x => x.room);
      const uniqueRooms = [...new Set(rooms)];
      this.setState({availableRoom:uniqueRooms}) 
    }
    filterList = (e) => {
      const name = e.target.name;
      let value = e.target.value;
      if(name === "type" ||name === "room" ||name === "advisor")
        {
          let {availableSessionsList} = this.state;
          let {filteredSessionList} =this.state;
          switch(name) {
          case "type" :
            filteredSessionList = availableSessionsList.filter(sessions => sessions.type===value  )
            this.setState({room:'',advisor:''});
            break;
          case "room" :
            filteredSessionList = availableSessionsList.filter(sessions => sessions.room===value  )
            this.setState({type:'',advisor:''});
              break;
          case "advisor" :
            filteredSessionList = availableSessionsList.filter(sessions => sessions.advisor===value  )
            this.setState({room:'',type:''});
              break;
          default:          
          }
          this.setState({filteredSessionList});
        }
        
      
      this.setState({[name]: value});
    }
    clearFilter = () => {
      this.setState({room:'',advisor:'',type:'', filteredSessionList:this.state.availableSessionsList})
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
      }


      componentDidMount = () => {
        this.initializeRows();
        this.getAvailableAdvisor();
        this.getAvailableRoom();
        this.getAvailableType();
        const {availableSessionsList} = this.state;
        this.setState({filteredSessionList:availableSessionsList})
      }

      toggleAddModal = (date,start_time,end_time,room,advisor,type) => {
        this.setState(prevState => ({
          addModal: !prevState.addModal,
          modal_advisor: advisor,
          modal_date: date,
          modal_start_time: start_time,
          modal_end_time: end_time,
          modal_room: room,
          modal_type: type,
        }));
      }

      dayClick =(value) => {
        let filteredSession = this.state.availableSessionsList;
        filteredSession = filteredSession.filter(session => parseInt(session.date.substring(0,2))=== parseInt(value.getDate()) && parseInt(session.date.substring(3,5))=== parseInt(value.getMonth()));
        this.setState({filteredSessionList:filteredSession})
      }

      weekClick = (week, date) => {
        console.log(week);
        let filteredSession = this.state.availableSessionsList;
        filteredSession = filteredSession.filter(session => this.getWeekNum(session.date).toString() === week.toString());
        this.setState({filteredSessionList:filteredSession})
      }

      getWeekNum = (d) => {
        var mydate = new Date(d.substring(3,5)+"/"+d.substring(0,2)+"/"+d.substring(6,10));
        return mydate.getWeek(); 
      }
      monthClick = (value) => {
        let filteredSession = this.state.availableSessionsList;
        console.log(value);
        filteredSession = filteredSession.filter(session => parseInt(session.date.substring(3,5))=== parseInt(value));
        this.setState({filteredSessionList:filteredSession})
      }


      toggle(tab){
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
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


      onFieldInput(event,index){
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        let targetRow = this.state.row;
        if(name == 'date')
        
          targetRow[index].date = value;
        if(name == 'start_time') {
          targetRow[index].start_time = value;
        }
        if(name == 'end_time'){
          targetRow[index].end_time = value;
        }
        if(name == 'advisor'){
          targetRow[index].advisor = value;
        }
        if(name == 'type'){
          targetRow[index].type = value;
        }
        if(name == 'room'){
          targetRow[index].room = value;
        }
        this.setState({row:targetRow});
        console.log(this.state.row)
        
      };


      initializeRows = () => {
        let newObject = [{...this.state.rowEntry},{...this.state.rowEntry},{...this.state.rowEntry}];
        for(let i = 0; i< 3; i++) {
          newObject[i].id = i
          
        }
        this.setState(prevState=>({row:newObject}))
        console.log(this.state.row)        
      };

      clear = (event) => {
        let num = event.currentTarget.name;
        num = parseInt(num);
        let {row} =this.state;
        const obj = {
          id:num-1,
          date:'',
          start_time:'',
          end_time:'',
          type: '',
          room: '',
          advisor:'',
        }
        row[num-1] = obj;
        this.setState({row}); 
      }
      handleAddSessions = () => {
        this.state.row.map(row => {
          if(row.date!=""&&row.start_time!=""&&row.end_time!=""&&row.room!=""&&row.advisor!=""&&row.type!="")
          this.setState(prevState=>({availableSessionsList: [...prevState.availableSessionsList, row]}), () => {
          const {availableSessionsList} = this.state;
          this.setState({filteredSessionList:availableSessionsList})
          })
        })
      }

render () {
  return (
    <Page>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
               onClick={() => { this.toggle('1'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Book Sessions
              </h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
               onClick={() => { this.toggle('2'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Admin Sessions
              </h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
               onClick={() => { this.toggle('3'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                No Show List
              </h4>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            
          </TabPane>
        </TabContent>
      </div>
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
              <Input type="select" name="type" value = {this.state.type}
                  onChange={this.filterList} >
                  <option disabled value="">Filter By Type</option>
                  {this.state.availableType.map(type => <option key = {type.toString()}>{type}</option>)}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Input type="select" name="room" value = {this.state.room}
                  onChange={this.filterList} >
                  <option disabled value="">Filter By Room</option>
                  {this.state.availableRoom.map(room => <option key = {room.toString()}>{room}</option>)}
              </Input>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <Input type="select" name="advisor" value = {this.state.advisor}
                  onChange={this.filterList} >
                  <option disabled value="">Filter By Advisor</option>
                  {this.state.availableAdvisor.map(advisor => <option key = {advisor.toString()}>{advisor}</option>)}
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
      <Row style={{backgroundColor:"#66bdff", paddingLeft:20}}>
      <h4>Sessions available</h4>
      </Row>
      <Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Room</th>
              {this.state.activeTab =="2" && <th>Advisor</th>}
              <th>Type</th>
              <th>Booked by</th>
              <th>Waiting</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.filteredSessionList).map(key => {
                const row = this.state.filteredSessionList[key];

                return <SessionsAvailableRow key={key} id={key} {...row} remove={this.remove} edit={this.edit} toggleAddModal={this.toggleAddModal} activeTab={this.state.activeTab}/>
              })}
            </tbody>
          </Table>
        </Row>
        <Row style={{backgroundColor:"#66bdff", paddingLeft:20}}>
      <h4>Add New Session</h4>
      </Row>
        <Row>
          <Col sm={9}>
            <Row>
              <Label sm={2}>
                  Date
              </Label>
              <Label sm={2}>
                  Start_Time
              </Label> 
              <Label sm={2}>
                  End_Time
              </Label> 
              <Label sm={2}>
                  Room
              </Label> 
              <Label sm={2}>
                  A/NA
              </Label> 
              <Label sm={2}>
                  Type
              </Label>
            </Row >
          </Col>
        </Row>
        <Row>
          <Col sm={9}>          
            {
              this.state.row.map((r,index) =>{
                return (
                  <Row key={index}>
                    <Col sm={2}>
                      <FormGroup>
                        <Input
                          type="text"
                          name='date'
                          value = {this.state.row[index].date}
                          onChange={(event)=>{this.onFieldInput(event, index)}}/>
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Input
                          type="text"
                          name='start_time'
                          value = {this.state.row[index].start_time}
                          onChange={(event)=>{this.onFieldInput(event, index)}}/>
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Input
                          type="text"
                          name='end_time'
                          value = {this.state.row[index].end_time}
                          onChange={(event)=>{this.onFieldInput(event, index)}}/>
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Input type="select" name="room" 
                            onChange={(event)=>{this.onFieldInput(event, index)}}
                            value = {this.state.row[index].room} >
                            <option  value=""></option>
                            {this.state.availableRoom.map(room => <option key = {room.toString()}>{room}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Input type="select" name="advisor" 
                            onChange={(event)=>{this.onFieldInput(event, index)}} 
                            value = {this.state.row[index].advisor}>
                            <option value=""></option>
                            {this.state.availableAdvisor.map(advisor => <option key = {advisor.toString()}>{advisor}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm={2}>
                      <FormGroup>
                        <Input type="select" name="type"
                            onChange={(event)=>{this.onFieldInput(event, index)}} 
                            value = {this.state.row[index].type}>
                            <option value=""></option>
                            {this.state.availableType.map(type => <option key = {type.toString()}>{type}</option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
              )})}
          </Col>
          <Col sm={3}>
            <Row>
            <Col>
              <FormGroup>
                <Button name="1" onClick={this.clear} color="primary">Clear</Button>
              </FormGroup>
            </Col>
            </Row>
            <Row>
            <Col>
              <FormGroup>
                <Button name="2" onClick={this.clear} color="primary">Clear</Button>
              </FormGroup>
            </Col>
            </Row>
            <Row>
            <Col>
              <FormGroup>
                <Button name ="3" onClick={this.clear} color="primary">Clear</Button>
              </FormGroup>
            </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <div style={{margin: "auto", width: "30%"}}>
            <Button type="submit" onClick={this.handleAddSessions}>Add Sessions</Button>
          </div>
        </Row>
        <Row style={{backgroundColor:"#66bdff", paddingLeft: "50"}}>
          <h4></h4>
        </Row>
    <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal}>
          <AvForm onValidSubmit={this.add}>
            <ModalHeader toggle={this.toggleAddModal}>
              Book Session
            </ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Label sm={3}>
                  Date :
              </Label>
              <Label sm={3}>
                  {this.state.modal_date}
              </Label>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>
                Advisor :
              </Label>
              <Label sm={4}>
                {this.state.modal_advisor}
              </Label>
            </FormGroup>
            <FormGroup row>
              <Label for="Time" sm={3}>
                  Time
              </Label>
              <Label for="Time" sm={4}>
                  {this.state.modal_start_time} - {this.state.modal_end_time}
              </Label>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>
                Campus :
              </Label>
              <Label sm={4}>
                {this.state.modal_room}
              </Label>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>
                Type :
              </Label>
              <Label sm={4}>
                {this.state.modal_type}
              </Label>
            </FormGroup>

              <FormGroup row>
                <Label sm={3}>
                  Student ID
                </Label>
                <Col sm={9}>
                  <Input type="input" name="modal_student_id" value = {this.state.modal_student_id} onChange={this.handleUserInput}></Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="size" sm={3}>
                  Appointment is for
                </Label>
                <Col sm={9}>
                  <Input type="select" name="modal_appointment_for" value = {this.state.modal_appointment_for} onChange={this.handleUserInput}>
                    <option value = "Discussing an assignment">Discussing an assignment</option>
                    <option value ="Preparing for a Seminar">Preparing for a Seminar</option>
                    <option value ="Other">Other</option>
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>
                  Subject Name *
                </Label>
                <Col sm={9}>
                  <Input type="input" name="modal_subject_name" value = {this.state.modal_subject_name} onChange={this.handleUserInput}></Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>
                  Assignment Type
                </Label>
                <Col sm={9}>
                  <Input type="input" name="modal_assignment_type" value = {this.state.modal_assignment_type} onChange={this.handleUserInput}></Input>
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" onClick={this.myFunction} >Book</Button>
            </ModalFooter>
          </AvForm>
      </Modal>
    </Page>
  )
}
}

export default Sessions;
