import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';
import {FaTrashAlt} from 'react-icons/fa'
import {MdModeEdit} from 'react-icons/md'

class PartyRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit(this.props.id,this.props.name,this.props.address,this.props.contact,this.props.email,this.props.NTN,this.props.GST)
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
        <td>{this.state.name}</td>
        <td>{this.state.address}</td>
        <td>{this.state.contact}</td>
        <td>{this.state.email}</td>
        <td>{this.state.NTN}</td>
        <td>{this.state.GST}</td>
        <td style={{paddingRight:0}}><Button outline color="secondary" onClick={this.edit}>{this.state.editing ? 'Cancel'  : <MdModeEdit />}</Button></td>
        <td style={{paddingLeft:0}}><Button outline color="danger" onClick={this.remove} ><FaTrashAlt/></Button></td>
      </tr>
    )
  }
}

export default PartyRow;