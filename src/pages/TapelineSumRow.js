import React, { Component } from 'react';
import { Button, Badge } from 'reactstrap';
import {FaTrashAlt} from 'react-icons/fa'
import {MdModeEdit} from 'react-icons/md'

class TapelineSumRow extends Component {
  state = {
    list:[],
  };

  edit = () => {
    this.props.edit(this.props.batch_id,this.props.inventory,this.props.tape_type.quality,this.props.tape_type.denier,this.props.tape_type.color,this.props.quantity,this.props.date_time)
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
    console.log("batch ID sent :", this.props.batch_id)
    this.props.remove(this.props.batch_id);
  }
  formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }    

  render() {
    return (
      <tr>
        <td>{this.state.date_time.substring(8,10)+
          this.state.date_time.substring(4,7)+"-"+
          this.state.date_time.substring(0,4)}</td>
        <td>{this.state.batch_id}</td>
        <td><h5>{this.state.inventory.map((inventory,index) => {
          return(
            <Badge pill key ={index} color = 'primary'>{inventory}</Badge>
          )
        })}</h5></td>
        <td>{this.state.tape_type.quality}</td>
        <td>{this.state.tape_type.denier}</td>
        <td>{this.state.tape_type.color}</td>
        <td>{this.state.quantity} Kg</td>
        <td style={{paddingRight:0}}><Button outline color="secondary" onClick={this.edit}>{this.state.editing ? 'Cancel'  : <MdModeEdit />}</Button></td>
        <td style={{paddingLeft:0}}><Button outline color="danger" onClick={this.remove} ><FaTrashAlt/></Button></td>
      </tr>
    )
  }
}

export default TapelineSumRow;
