import React, { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './customHooks/redux';
import useGeoLocation from './customHooks/useGeoLocation';
import { useGetByCityNameQuery, useGetWeatherByGeoLocationQuery } from './store/reducers/openWeatherApi';
import { userSlice } from './store/reducers/UserSlice';

// 1. Реализовать получение города по IP адресу и ввод города в search. Done!
// 2. Подключить и настроить редакс. Done!
// 3. В redux store хранить все данные с api и выбранным городом.

// const UNSPLASH_ACCESS_KEY = 'DON2j_WwiFgfpZpAs8GcG5MrGG1E9ZcVcjhJW-5yaf8';

// const WEATHER_BIT_API_KEY =
//   '70c100dd35234454816afc7edc843093';

function App() {
  useGeoLocation();
  const {
    city, requestCity, cityGeoLocation, userCity,
  } = useAppSelector((state) => state.userReducer);
  const { data: cityInfo, isLoading } = useGetByCityNameQuery(requestCity);
  const { data: weather } = useGetWeatherByGeoLocationQuery(cityGeoLocation);
  const { changeCity, changeRequestCity, getCityGeoLocation } = userSlice.actions;
  const dispatch = useAppDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(changeCity(e.target.value));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(changeRequestCity(city));
  };

  useEffect(() => {
    console.log('app');
    if (!requestCity) {
      dispatch(changeRequestCity(userCity));
      dispatch(changeCity(userCity));
    } else {
      dispatch(changeCity(requestCity));
    }
    if (cityInfo) dispatch(getCityGeoLocation(cityInfo.coord));
  }, [
    changeCity, changeRequestCity, cityInfo, dispatch, getCityGeoLocation, requestCity, userCity,
  ]);
  console.log('weather', weather);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      Hello Weather App
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={handleChange} placeholder="City name..." />
      </form>
    </div>
  );
}

export default App;
