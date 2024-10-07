import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { WeatherForecastAPI } from '../../api/weatherAPI'
import { useNavigate } from 'react-router-dom';

const weatherDescriptions = {
    'Fair': '⛅️',
    'Fair (Day)': '🌤️',
    'Fair (Night)': '🌙',
    'Fair and Warm': '☀️',
    'Partly Cloudy': '⛅️',
    'Partly Cloudy (Day)': '🌤️',
    'Partly Cloudy (Night)': '🌙',
    'Cloudy': '☁️',
    'Hazy': '🌫️',
    'Slightly Hazy': '🌫️',
    'Windy': '🌬️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Light Rain': '🌧️',
    'Moderate Rain': '🌧️',
    'Heavy Rain': '🌧️',
    'Passing Showers': '🌦️',
    'Light Showers': '🌦️',
    'Showers': '🌦️',
    'Heavy Showers': '🌧️',
    'Thundery Showers': '⛈️',
    'Heavy Thundery Showers': '⛈️',
    'Heavy Thundery Showers with Gusty Winds': '⛈️🌬️',
}

function WeatherComponent() {
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDisplaying, setIsDisplaying] = useState(false);

    const navigate = useNavigate();

    async function apiGetAsync() {
        try {
            const response = await WeatherForecastAPI.get('/');
            if (response.status === 200) {
                console.log(response.data.data.records[0].periods);
                setWeatherData(response.data.data.records[0].periods);
                setIsLoading(false);
                setIsDisplaying(true);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // useEffect(() => {
    //   apiGetAsync();
    // }, [])

    function handleBackToHome() {
        navigate('/');
    }

    return (
        <div className="App">
            <div className="content-container">
                <h2>24-hour Weather</h2>
                {!isDisplaying && <button onClick={apiGetAsync}>Load weather data</button>}
                {isDisplaying && <button onClick={handleBackToHome}>Back to home</button>}
                {isLoading ? <p>^ Click on load weather data ^</p> : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time Period</th>
                                    <th>Central</th>
                                    <th>East</th>
                                    <th>North</th>
                                    <th>South</th>
                                    <th>West</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weatherData.map((data) => (
                                    <tr key={uuid()}>
                                        <td>{data.timePeriod.text}</td>
                                        <td>{data.regions.central.text + "   " + weatherDescriptions[data.regions.central.text]}</td>
                                        <td>{data.regions.east.text + "   " + weatherDescriptions[data.regions.east.text]}</td>
                                        <td>{data.regions.north.text + "   " + weatherDescriptions[data.regions.north.text]}</td>
                                        <td>{data.regions.south.text + "   " + weatherDescriptions[data.regions.south.text]}</td>
                                        <td>{data.regions.west.text + "   " + weatherDescriptions[data.regions.west.text]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p>The above weather data is sourced from: https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default WeatherComponent;