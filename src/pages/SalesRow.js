import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';

class SaleRow extends Component {
  state = {
  };

  edit = () => {
    this.props.edit()
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
edit = () => {
  this.props.remove(this.props.id)
}

  render() {
    return (
      <tr>
        <td>{this.state.id}</td>
        <td>{this.state.date}</td>
        <td>{this.state.customer_name}</td>
        <td>{this.state.width}x{this.state.length}</td>
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

export default SaleRow;