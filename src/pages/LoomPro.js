import React, { Component } from 'react';
import { Button, Badge, Col } from 'reactstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

class LoomPro extends Component {
    state = {
    };

  open = () => {
    this.props.openProductionModal(this.state.loom_number)
  }
  constructor( props ){
    super();
    this.state = { ...props }
}
  componentWillReceiveProps = ( nextProps ) =>{
    this.setState( { ...nextProps } );

}

  render() {
    return (
        <Col lg="2" md="5" sm="6" xs="5">
        <button style = {{border:0, padding: 0, background:'#fff' }}  onClick={this.open}>
          <CircularProgressbar
          circleRatio ={0.54} 
          value={this.state.total_meters/this.state.loom_meter_denom} 
          text={this.state.loom_number}
          styles={buildStyles({
              rotation: -0.25,
              strokeLinecap: 'butt',
              textSize: '16px',
              pathTransitionDuration: 0.5,
              pathColor: this.state.total_meters/this.state.loom_meter_denom < 20 ? `#FF0000` : this.state.total_meters/this.state.loom_meter_denom < 60 ? '#6A5ACD' : this.state.total_meters/this.state.loom_meter_denom < 80 ? '#1E90FF' : '#7CFC00',
              textColor: '#f88',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}/>
          </button>
        </Col>
    )
  }
}

export default LoomPro;