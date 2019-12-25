import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';

class PrintRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit(this.props.id,this.props.machine,
        this.props.stereo_name+ " ("+ this.props.stereo_width.substring(0,2)
        +"x"+this.props.stereo_length.substring(0,2)+")",
        this.props.width,this.props.length,this.props.quality,
        this.props.color,this.props.weight,this.props.frame)
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
        <td>{this.state.id}</td>
        <td>{this.state.machine}</td>
        <td>{this.state.stereo_name} ({this.state.stereo_width}x{this.state.stereo_length})</td>
        <td>{this.state.width} x {this.state.length}</td>
        <td>{this.state.quality}</td>
        <td>{this.state.color}</td>
        <td>{this.state.frame}</td>
        <td>{this.state.weight}</td>
        <td>{this.state.quantity}</td>
        <td><Button color="info" onClick={this.edit}>{this.state.editing ? 'Cancel'  : 'Edit'}</Button></td>
      </tr>
    )
  }
}

export default PrintRow;