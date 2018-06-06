import React, { Component } from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import './Graph.css';

class Graph extends Component {
  render() {
    return (
      <div className="graph-container">
        <div className="graph-info">
          <span><i className="fa fa-arrow-left"></i></span>
          <span>Week Long Trends</span>
          <span><i className="fa fa-arrow-right"></i></span>
        </div>
        <div className="graph">
          <Sparklines data={this.props.data}>
            <SparklinesLine color="#00cec9" />
            <SparklinesSpots style={{ fill: "#ecf0f1" }} />
          </Sparklines>
        </div>
      </div>
    );
  }
}

export default Graph;
