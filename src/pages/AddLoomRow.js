import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';
import {FaTrashAlt} from 'react-icons/fa'
import {MdModeEdit} from 'react-icons/md'

class AddLoomRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit(this.props.loom_number,this.props.circumference)
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


  remove = () => {
    console.log("batch ID sent :", this.props.id)
    this.props.remove(this.props.id);
  }
  render() {
    return (
      <tr>
        <td>{this.state.loom_number}</td>
        <td>{this.state.circumference}</td>
        <td style={{paddingRight:0}}><Button outline color="secondary" onClick={this.edit}>{this.state.editing ? 'Cancel'  : <MdModeEdit />}</Button></td>
        <td style={{paddingLeft:0}}><Button outline color="danger" onClick={this.remove} ><FaTrashAlt/></Button></td>
      </tr>
    )
  }
}

export default AddLoomRow;