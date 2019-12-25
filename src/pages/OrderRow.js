import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import axios from 'axios';

class OrderRow extends Component {
  state = {};

  edit = () => {
    for(let i in this.state.customerList){
      for(let j in this.state.orderList){
      
      if(this.state.customerList[i].name==this.state.orderList[j].customer){
        
        this.state.orderList[j].customer=this.state.customerList[i].id;
        this.forceUpdate()
    }
    }
  }
  console.log("New List",this.state.customerList);
  for(let i in this.state.stereoList){
    for(let j in this.state.orderList){
    
    if(this.state.stereoList[i].name==this.state.orderList[j].stereo){
      
      this.state.orderList[j].stereo=this.state.stereoList[i].id;
      this.forceUpdate()
      console.log(this.state.orderList);
  }
  }
  }    
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  }


  constructor( props ){
    super();
    this.state = { ...props }
    this.myFunction = this.myFunction.bind(this);
}
  save = (event, values) => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));

  }
  componentWillReceiveProps( nextProps ){
    this.setState( { ...nextProps } );
}

customerNameReplaceWithID = () => {    
 
  
}
stereoNameReplaceWithId = () => {    
 
}
myFunction(event)
{   
    event.preventDefault();
    let myobject = {
      "date": this.state.date,
      "customer": this.state.customer,
      "stereo": this.state.stereo,
      "bag_type": {
          "width": this.state.size.substring(0,2),
          "length": this.state.size.substring(3,5),
          "frame": this.state.frame,
          "color": this.state.color,
      },
      "quality": this.state.quality,
      "quantity": this.state.quantity,
  }
  let con = 'http://127.0.0.1:8000/app/order/';
              con = con.concat(this.state.orderList.id,"/");
              axios.put(con, this.state.orderList)
}


  remove = () => {
    this.props.remove(this.props.id);
  }
  render() {
    return (
      <tr>
        <td>{this.state.id}</td>
        <td>{this.state.date}</td>
        <td>{this.state.customer_name}</td>
        <td>{this.state.stereo_name}</td>
        <td>{this.state.bag_type.width+"x"+this.state.bag_type.length}</td>
        <td>{this.state.bag_type.color}</td>
        <td>{this.state.quality}</td>
        <td>{this.state.bag_type.frame}</td>
        <td>{this.state.quantity}</td>
        <td>
        <Button color="info" onClick={this.edit}>{this.state.editing ? 'Cancel'  : 'Edit'}</Button></td>
        <td><Button color="danger" onClick={this.remove}>Remove</Button></td>
      </tr>
    )
  }
}

export default OrderRow;
