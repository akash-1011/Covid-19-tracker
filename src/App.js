import React, { useEffect, useState } from 'react';
import './App.css';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table.js'
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then((data) => {
        const countries = data.map(country => ({
          name: country.country,
          value: country.countryInfo.iso2
        }))

        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
    }

    getCountriesData();
  },[])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    
    const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`   
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    })

  }

  return (
    <div className="app">
      <div className='app-left'>
        <div className='app-header'> 
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app-dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country,idx) => (
                  <MenuItem key={idx} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className='app-stats'>
            <InfoBox 
              isRed
              active={casesType === 'cases'}
              onClick={e => setCasesType('cases')}
              title='Coronavirus Cases'
              total={countryInfo.cases}
              cases={prettyPrintStat(countryInfo.todayCases)}
            />
            <InfoBox 
              active={casesType === 'recovered'}
              onClick={e => setCasesType('recovered')}
              title='Recovered'
              total={countryInfo.recovered}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
            />
            <InfoBox 
              isOrange
              active={casesType === 'deaths'}
              onClick={e => setCasesType('deaths')}
              title='Deaths'
              total={countryInfo.deaths}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
            />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app-right'>
        <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 style={{marginBottom:'10px'}}>Worldwide new {casesType}</h3>
            <LineGraph className='app-graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
