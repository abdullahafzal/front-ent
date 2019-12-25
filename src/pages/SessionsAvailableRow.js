import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';

class LoomRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit(this.props.id,this.props.loom_number,this.props.width,this.props.length,this.props.quality,this.props.color,this.props.weight,this.props.frame)
  }

  toggleAddModal = () => {
    this.props.toggleAddModal(this.props.date,this.props.start_time,this.props.end_time,this.props.room,this.props.advisor,this.props.type)
  }
  constructor( props ){
    super();
    this.state = { ...props }
}
  save = (event, values) => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));

  }
  componentWillReceiveProps = ( nextProps ) =>{
    this.setState( { ...nextProps } );

}

  render() {
    return (
      <tr>
        <td>{this.state.date}</td>
        <td>{this.state.start_time}</td>
        <td>{this.state.end_time}</td>
        <td>{this.state.room}</td>
        {this.state.activeTab == "2" && <td>{this.state.advisor}</td>}
        <td>{this.state.type}</td>
        <td>{this.state.student == ""? <Button onClick={this.toggleAddModal}>Book this Session</Button> :
             this.state.activeTab == "1" ? "Booked" : this.state.student}</td>
        <td><Button color="info" onClick={this.toggleAddModal}>Add</Button></td>
      </tr>
    )
  }
}

export default LoomRow;