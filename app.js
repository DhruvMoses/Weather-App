//for the part where user can enter country, and search button
const cityInput = document.querySelector(".city-input")
const searchBtn = document.querySelector(".search-btn")

//for the part wheere u cane search a country, and if it is not found
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

//for the main area where all the weather info is there
const weatherInfoSection = document.querySelector('.weather-info')

//the part where country, 29°C, cloudy/windy are there
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt') 
const conditionTxt = document.querySelector('.condition-txt')

//for the part where humidity value, wind speed value is written
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')

//for the main big image of weather
const weatherSummaryImg = document.querySelector(".weather-summary-img")

//for current day and date
const currentDateTxt = document.querySelector(".current-date-txt")

//for the future forecast items
const forecastItemsContainer = document.querySelector('.forecast-items-container')

//for api
const apiKey = "75d7d42f515a685d734eac17e441115d";




//This function is for when the search btn is "clicked" using mouse pointer
searchBtn.addEventListener("click" , () => {

    if(cityInput.value.trim() != ""){    //so that blank or empty searches are recorded
const cityInput = document.querySelector(".city-input")
      updateWeatherInfo(cityInput.value);
      cityInput.value = ""; 
    }
});

//This function is for input section when "Enter" key is pressed instead of mouse pointer
cityInput.addEventListener("keydown", (event) => {
    if(event.key == 'Enter' && cityInput.value.trim() != ""){
        updateWeatherInfo(cityInput.value);
        cityInput.value = ""; 
    }
})


//This function is to get data from the API
async function getFetchData(endPoint , city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiUrl);

    return response.json()
}

//this function will change the weather img acc to the weather using "id" 
function getWeatherIcon(id){    //we can get id for each weather on openweather website 
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

//this function will give the current date and day
function getCurrentDate(){
     const currentDate = new Date();
     const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
     }
    return currentDate.toLocaleDateString('en-GB', options )
}

//This function updates the weather information or tells not found for invalid country
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather' , city);

    if(weatherData.cod != 200){  //if the user enters wrong country
        showDisplaySection(notFoundSection);
        return
    }
    

    const {  //we are taking out all the important items like: country name, temp, humidity, weather, wind speed all these are available in the api
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    
    countryTxt.textContent = country //for changing country name
    tempTxt.textContent = Math.floor(temp) + '°C' //for changing temperature
    conditionTxt.textContent = main  //for changing the clouds,rainy conditions
    humidityValueTxt.textContent = humidity + '%' //for changing the humidity value
    windValueTxt.textContent = speed + ' M/s '
    weatherSummaryImg.src =  `assets/weather/${getWeatherIcon(id)}` //for changing the big weather image
    currentDateTxt.textContent = getCurrentDate() //for changing the date to latest

    await updateForecastsInfo(city) //this will update all the scrolling temp of next 4-5 days

    showDisplaySection(weatherInfoSection) //this will bring the main page ui when correct country is entered
}

//this function will update the forecasts of future next days 
async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]  //this will give the date and time in array, so 0th index is "Date"

    forecastItemsContainer.innerHTML = ` `

    forecastData.list.forEach(forecastWeather => {

        if(forecastWeather.dt_txt.includes(timeTaken) && 
           !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
        }
    })
} 

//this function updates the fututre forecasts 
function updateForecastItems(weatherData){
    console.log(weatherData);
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData

    //this gives future day and date in the fututre forecasts
    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short' 
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.floor(temp)}°C</h5>
        </div>
    `

    // Inserts the forecastItem inside forecastItemsContainer at the end
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){   //this will blank the screen if you enter wong country and press enter or mouse click
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')  //these are all the sections

        section.style.display = "flex" //this will bring the "404 error img" whenever a wrong country is entered
} 
  


//notes:

//->.toISOString() → Converts the Date object into a standardized string format known as ISO 8601.
//     The ISO 8601 format represents date and time in a universal standard format:
//     YYYY-MM-DDTHH:mm:ss.sssZ
//     YYYY → Year
//     MM → Month
//     DD → Day
//     T → Separator between date and time
//     HH:mm:ss.sss → Hours, minutes, seconds, and milliseconds
//     Z → Represents UTC (Coordinated Universal Time)