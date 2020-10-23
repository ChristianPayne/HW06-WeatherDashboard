// https://openweathermap.org/forecast5 API Documentation

// Document.ready shorthand.
$()
{
    var searchInput = $("#search-input");
    var pastCities = $("#past-cities");

    // On Click Functions
    $("#search-button").on("click", function ()
    {
        searchForACity(searchInput.val());
    });


    function searchForACity(cityName) 
    {
        getFiveDayForecast(cityName);
        // FIXME: This doesn't clear the input field.
        searchInput.text('');
    }

    function getFiveDayForecast (cityName)
    {
        var escapedSearch = encodeURI(cityName);
        const settings = 
        {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/forecast?q=" + escapedSearch,
            "method": "GET",
            "headers": 
            {
                "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
                "x-rapidapi-key": "ee6b96472fmshd92b732193173abp1c0a9ajsnb454fe423af1"
            }
        };

        $.ajax(settings).done(function (response) 
        {
            var cityReturned = response.city.name;

            // For the 5 day forecast.
            for (let i = 0; i < response.list.length; i++) {
                
            }

            // Add the city to the history section.
            addCityToHistory(cityReturned);
            console.log(response);

            // Add the city stats to the stats display.
            $('#city-name-date').text(response.city.name + " (" + response.list[0].dt_txt + ")");
            var temp = $('<br><p>').text("Temperature: " + kelvinToFahrenheit(response.list[0].main.temp) + " ℉");
            $("#current-stats").append(temp);
        });
    }

    function addCityToHistory (cityName)
    {
        // Make a new button.
        var currentCity = $('<button type="button" class="list-group-item list-group-item-action">');
        // Add an on Click event to the history buttons.
        currentCity.click(function() {
            searchForACity(cityName);
        });
        // Set the text.
        currentCity.text(cityName);

        // Add the current city to the list.
        pastCities.prepend(currentCity);

        // Limit there to only be 5 history entries.
        if(pastCities.children().length > 5)
        {
            pastCities.contents().last().remove();
        }
    }

    // For loading from persistent data/
    function loadCitiesFromHistory ()
    {

    }
    // For saving to persistent data.
    function saveCityIntoHistory ()
    {
        
    }

    // Helper function to convert Kelvin to Fahrenheit
    function kelvinToFahrenheit (kelvin)
    {
        var f = Math.round(((kelvin-273.15)*1.8)+32);
        return f;
    }
};