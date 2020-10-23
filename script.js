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
        searchInput.value = '';
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
            for (let i = 0; i < response.list.length; i++) {
                
            }
            addCityToHistory(cityReturned);
            console.log(response);
        });
    }

    function addCityToHistory (cityName)
    {
        var currentCity = $('<button type="button" class="list-group-item list-group-item-action">');
        currentCity.click(function() {
            searchForACity(cityName);
        });
        currentCity.text(cityName);

        pastCities.prepend(currentCity);

        if(pastCities.children().length > 3)
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
};