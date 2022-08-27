import './style.css';

const domManip = (() => {
    const searchButton = document.querySelector(".search-button");
    const clearButton = document.querySelector(".reset-button");
    searchButton.addEventListener("click", fetchCurrentWeather);
    clearButton.addEventListener("click", clearSearch);
    document.addEventListener("DOMContentLoaded", function hideBrokenImg() {
        let firstLoadImg = document.querySelector('img');
        firstLoadImg.style.display='none';
    });
})();


async function fetchCurrentWeather(searchCity, searchCountry) {
    try {
        const searchCity = document.getElementById("search-city").value;
        const searchCountry = document.getElementById("search-country").value;
        

        if (searchCity == "" || searchCountry == "") {
            alert("please fill all the necessary information and try again");
            return;
        }

        const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "," + searchCountry + "&units=metric&APPID=c5859eedec9c649f9bfd099ad099e72b", { mode: "cors"});
        const currentData = await response.json();

        
        const currentWeather = {
            mainWeather: currentData.weather[0].main,
            place: currentData.name + ", " + currentData.sys.country,
            temp: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity + "%",
            wind: Math.round(currentData.wind.speed) + " MPH"
        };


        displayWeather(currentWeather);

       getGiphy(currentWeather.mainWeather);

    } catch (err) {
        console.log("Something has went wrong with fetching the current weather data....", err);
        alert("Something has went wrong with fetching the current weather data....");
    }
}

function clearSearch() {
    document.getElementById("search-city").value = "";
    document.getElementById("search-country").value = "";
    const img = document.querySelector("img");
    img.style.display = "none";
    clearDOM();
}


function displayWeather(currentWeather) {
    const displayDiv = document.querySelector(".display-div");

    clearDOM();

    const city = document.createElement("p");
    city.textContent = currentWeather.place;
    displayDiv.appendChild(city);
    const status = document.createElement("p");
    status.textContent = currentWeather.mainWeather;
    displayDiv.appendChild(status);
    const cityTemp = document.createElement("p");
    cityTemp.textContent = currentWeather.temp + " Degrees";
    displayDiv.appendChild(cityTemp);
    const cityHumidity = document.createElement("p");
    cityHumidity.textContent = currentWeather.humidity + " Humidity";
    displayDiv.appendChild(cityHumidity);
    const cityWind = document.createElement("p");
    cityWind.textContent = currentWeather.wind + " Wind";
    displayDiv.appendChild(cityWind);
}

 async function getGiphy(mainWeather) {
    try {
        const img = document.querySelector("img");
        let keyWord = mainWeather;
        if (keyWord == "Clear") {
            keyWord = "Clear Sky";
        }
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=J4085QjVBp3gSed80DvKzXRQa9TAn7Tt&s=${keyWord}`, { mode: "cors" });
        const giphyResponse = await response.json();
        console.log(giphyResponse);
        img.style.display = "";
        img.src = giphyResponse.data.images.original.url;
    } catch (err) {
      console.log("Something has went wrong when trying to fetch the giphy...", err);
    }
}

function clearDOM() {

    const nodeList = document.querySelectorAll("p");
    if (nodeList !== null) {
        for (let i = 0; i < nodeList.length; i ++) {
            nodeList[i].remove();
        }
    }
}