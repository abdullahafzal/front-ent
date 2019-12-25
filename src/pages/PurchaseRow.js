import React, { Component } from 'react';
import { Button } from 'reactstrap';

class PurchaseRow extends Component {
  state = {};

  edit = () => {
   
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
  componentWillReceiveProps( nextProps ){
    this.setState( { ...nextProps } );
}



  remove = () => {
    this.props.remove(this.props.id);
  }
  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  removeZeros = (num) => {
    return num.replace(/(\.0)/g,"")
  }
  render() {
    return (
      <tr>
        <td>{this.state.id}</td>
        <td>{this.state.date_time.substring(8,10)+
          this.state.date_time.substring(4,7)+"-"+
          this.state.date_time.substring(0,4)}</td>
        <td>{this.state.supplier_name}</td>
        <td>{this.state.item_category}</td>
        <td>{this.state.item_name}</td>
        <td>{this.removeZeros(this.formatNumber(this.state.unit))} Bags</td>
        <td>{this.removeZeros(this.formatNumber(this.state.quantity))} KG</td>
        <td>{this.formatNumber(this.state.price)} Rs</td>
        <td>{this.state.comments}</td>
        <td>
        <Button color="info" onClick={this.edit}>{this.state.editing ? 'Cancel'  : 'Edit'}</Button></td>
        <td><Button color="danger" onClick={this.remove}>Remove</Button></td>
      </tr>
    )
  }
}

export default PurchaseRow;
