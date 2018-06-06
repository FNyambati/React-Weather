
import React, { Component } from 'react';
import axios from 'axios';

import Navbar from '../Navbar';
import Today from '../Today';
import List from '../List';
import Graph from '../Graph';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: 'F',
      queryString: '',
      latLng: [],
      navbarData: {},
      todayData: {},
      listData: [],
      graphData: []
    };
  }

  componentDidMount() {
    const geolocation = navigator.geolocation;
    if(geolocation) {
      const allowed = (position) => {
        console.log(position);
        this.setState({
          latLng: [position.coords.latitude, position.coords.longitude]
        }, this.notifyStateChange);
      }
      const denied = () => {
        console.log('You Shall Not Pass!');
      }

      geolocation.getCurrentPosition(allowed, denied)
    }
    else {
      console.log("Browser Not Supported, GET OF IE :/")
    }
  }

  onUnitChange = (newUnit) => {
    this.setState({
      unit: newUnit
    }, this.notifyStateChange)
  }

  onSearchSubmit = (query) => {
    this.setState({
      queryString: query,
      latLng: [],
    }, this.notifyStateChange)
  }


  notifyStateChange = () => {
    const validLatLng = this.state.latLng.length > 0;
    const validLocation = (this.state.queryString !== '');

    if (validLatLng || validLocation) {
      this.getWeather(validLatLng).then(weatherData => {
        console.log('Forecast Data:', weatherData);
        // Extract component specific data...
        const navbarData = this.dataForNavbar(weatherData);
        const todayData = this.dataForToday(weatherData);
        const { listData, graphData } = this.dataForListAndGraph(weatherData);

        this.setState({
          navbarData,
          todayData,
          listData,
          graphData
        })
        console.log(this.state);
      }).catch(error => {
        console.log('Error:', error);
      });
    }
  }

  getWeather = (validLatLng) => {
    const API_KEY = '789c7a808690dc32dbf1324ad4b2e1e3';
    const ANCHOR_URL = 'https://api.openweathermap.org/data/2.5/forecast/daily';
    const queryParams = (validLatLng) ? `lat=${this.state.latLng[0]}&lon=${this.state.latLng[1]}` : `q=${this.state.queryString}`;
    const unitType = (this.state.unit === 'F') ? 'imperial' : 'metric';

    const url = `${ANCHOR_URL}?${queryParams}&units=${unitType}&cnt=7&appid=${API_KEY}`;
    console.log('URL is ', url);

    return axios.get(url).then(response => {
      return response.data;
    }).catch(error => {
      console.log('Error found:', error);
    })
  }

  dataForNavbar = (weatherData) => {
    return {
      city: `${weatherData.city.name}, ${weatherData.city.country}`
    };
  }

  dataForToday = (weatherData) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const todaysWeather = weatherData.list[0];

    const time = new Date(todaysWeather.dt * 1000);
    const day = this.getDay(time);
    const date = `${monthNames[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`

    const weatherId = todaysWeather.weather[0].id;
    const description = todaysWeather.weather[0].description;

    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 20;
    let mainTemperature = (isDayTime) ? todaysWeather.temp.day : todaysWeather.temp.night;
    mainTemperature = Math.round(mainTemperature);
    const minTemperature = Math.round(todaysWeather.temp.min);
    const maxTemperature = Math.round(todaysWeather.temp.max);

    const pressure = todaysWeather.pressure;
    const humidity = todaysWeather.humidity;
    const windSpeed = todaysWeather.speed;

  return {
    day,
    date,
    weatherId,
    description,
    mainTemperature,
    minTemperature,
    maxTemperature,
    pressure,
    humidity,
    windSpeed
  }
}

dataForListAndGraph = (weatherData) => {
    const listData = [];
    const graphData = [];

    weatherData.list.forEach(forecast => {
        let item = {};
        item.day = this.getDay(forecast.dt * 1000);
        item.weatherId = forecast.weather[0].id;
        item.description = forecast.weather[0].description;
        item.mainTemperature = Math.round(forecast.temp.day);

        listData.push(item);
        graphData.push(forecast.temp.day)
    });

    // Remove first element as that represents today's weather
    listData.shift();

    return {
        listData,
        graphData
    }
}

// Takes date object or unix timestamp in ms and returns day string
getDay = (time) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday ", "Friday", "Saturday"];
  return days[(new Date(time).getDay())];
}

  render() {
    const validLatLng = this.state.latLng.length > 0;
    const validLocation = (this.state.queryString !== '');
    const willRenderApp = validLatLng || validLocation;

    const appDirections =<div className="app-directions">
      <p>Allow Location Access or type city name/zip code in search area to get started.</p>
    </div>

    const mainApp = <React.Fragment>
      <div className="app-today">
        <Today data={this.state.todayData} unit={this.state.unit}/>
      </div>
      <div className="app-list-graph">
        <List data={this.state.listData}/>
        <Graph data={this.state.graphData}/>
      </div>
    </React.Fragment>

    return (
      <div className="app-container">
        <div className="app-nav">
          <Navbar
            searchSubmit={this.onSearchSubmit}
            changeUnit={this.onUnitChange}
            unit={this.state.unit}
            data={this.state.navbarData}
          />
        </div>

        {willRenderApp ? mainApp : appDirections}
      </div>
    );
  }
}

export default App;
