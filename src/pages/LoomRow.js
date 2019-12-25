import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';
import {MdModeEdit} from 'react-icons/md'

class LoomRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit(this.props.id,this.props.loom_number,this.props.width,this.props.length,this.props.quality,this.props.color,this.props.weight,this.props.frame)
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
        <td>{this.state.state === "Running"? <Badge pill style={{background:"#11aa11"}}>></Badge>  : this.state.state === "Stopped" ? <Badge pill style={{background: "#fa1111"}}>||</Badge> : <Badge pill style={{background:"#444444"}}>-/-</Badge>}</td>
        <td>{this.state.loom_number}</td>
        <td>{this.state.width} x {this.state.length}</td>
        <td>{this.state.quality}</td>
        <td>{this.state.color}</td>
        <td>{this.state.frame}</td>
        <td>{this.state.weight}</td>
        <td>{this.state.rpm}</td>
        <td><Button outline color="secondary" onClick={this.edit}>{this.state.editing ? 'Cancel'  : <MdModeEdit />}</Button></td>
      </tr>
    )
  }
}

export default LoomRow;