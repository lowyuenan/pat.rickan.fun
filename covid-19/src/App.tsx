import React, { useState, useEffect } from "react";
import "./App.scss";

const API_URL = "https://covid19.mathdro.id/api";
const MALAYSIA_API_URL = "https://covid19.mathdro.id/api/countries/MYS";
const OG_API_URL = "https://covid19.mathdro.id/api/og";

function App() {
  const [data, setData] = useState<Record<string, any>>({});
  const [mas_data, setMasData] = useState<Record<string, any>>({});
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    fetchData(API_URL, setData);
    fetchData(MALAYSIA_API_URL, setMasData);
  }, [counter]);

  useEffect(() => {
    const countIntervalInit = countInterval(setCounter);
    countIntervalInit();
  }, []);

  const confirmed = data.confirmed?.value;
  const recovered = data.recovered?.value;
  const deaths = data.deaths?.value;
  const lastUpdate = data.lastUpdate
    ? `${new Date(data.lastUpdate).toDateString()} ${new Date(
        data.lastUpdate
      ).toTimeString()}`
    : "";

  const mas_confirmed = mas_data.confirmed?.value;
  const mas_recovered = mas_data.recovered?.value;
  const mas_deaths = mas_data.deaths?.value;

  console.dir(data);

  return (
    <div className="App">
      <div className="img">
        <figure>
          <img src={OG_API_URL} alt="Not Found" />
        </figure>
      </div>
      <div className="header ibc">
        <div className="overall">
          <h1>Overall</h1>
          <p>Confirmed: {confirmed}</p>
          <p>Recovered: {recovered}</p>
          <p>Deaths: {deaths}</p>
          <p>Active: {confirmed - recovered - deaths}</p>
          <p>Fatal Rate: {`${getRate(deaths, confirmed)}%`}</p>
          <p>Recover Rate: {`${getRate(recovered, confirmed)}%`}</p>
        </div>
        <div className="mas">
          <h1>Malaysia</h1>
          <p>Confirmed: {mas_confirmed}</p>
          <p>Recovered: {mas_recovered}</p>
          <p>Deaths: {mas_deaths}</p>
          <p>Active: {mas_confirmed - mas_recovered - mas_deaths}</p>
          <p>Fatal Rate: {`${getRate(mas_deaths, mas_confirmed)}%`}</p>
          <p>Recover Rate: {`${getRate(mas_recovered, mas_confirmed)}%`}</p>
        </div>
      </div>
      <div className="date">
        <p>Last Update: {lastUpdate}</p>
      </div>
    </div>
  );
}

function fetchData(url: string, setFn: React.Dispatch<{}>) {
  fetch(url)
    .then((r) => r.json())
    .then((j) => setFn(j));
}

function countInterval(setCounter: React.Dispatch<number>) {
  let c = 0;
  return function () {
    setInterval(() => {
      setCounter(c++);
    }, 30000);
  };
}

function getRate(x: number, y: number) {
  return Math.round((x / y) * 10000) / 100;
}

export default App;
