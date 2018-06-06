import React, { Component } from 'react';
import './Navbar.css';
import Search from '../Search';
import UnitSwitch from '../UnitSwitch';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendNewUnitToParent = (newUnit) => {
    this.props.changeUnit(newUnit);
  }

  sendQueryStringToParent = (query) => {
    this.props.searchSubmit(query);
  }

  render() {
    return (
      <nav>
        <ul className="navbar-container">
          <li className="navbar-list-item">
            <Search searchSubmit={this.sendQueryStringToParent}/>
          </li>
          <li className="navbar-list-item city-name">
            <span>{this.props.data.city}</span>
          </li>
          <li className="navbar-list-item">
            <UnitSwitch unit={this.props.unit} onUnitChange={this.sendNewUnitToParent}/>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
