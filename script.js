// https://openweathermap.org/forecast5 API Documentation

// Document.ready shorthand.
$()
{
    var searchInput = $("#search-input");
    var pastCities = $("#past-cities");

    loadCitiesFromHistory();

    // On Click Functions
    $("#search-button").on("click", function ()
    {
        searchForACity(searchInput.val());
    });


    function searchForACity(cityName) 
    {
        getFiveDayForecast(cityName);
        searchInput.val('');
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
            // Add the cards for the 5-day.
            addCardsForFiveDayForecast(response);

            // Add stats for today.
            addStatsToTodaysForecast(response);
        });
    }

    function addStatsToTodaysForecast (apiData)
    {
        var cityReturned = apiData.city.name;
        // Add the city to the history section.
        addCityToHistoryPanel(cityReturned);

        // Add the city stats to the stats display.
        $('#city-name-date').text(apiData.city.name + " (" + cropDateFromTime(apiData.list[0].dt_txt) + ")");

        // Clear the current div.
        $('#current-stats').empty();
        
        // Add in all the new stats.
        var temp = $('<p>').text("Temperature: " + kelvinToFahrenheit(apiData.list[0].main.temp) + " ℉");
        var hum = $('<p>').text("Humidity: " + apiData.list[0].main.humidity + "%");
        var wind = $('<p>').text("Wind Speed: " + apiData.list[0].wind.speed + "mph");
        var uv = $('<p>').text("UV Index: " + apiData.list[0].weather[0].id / 100);

        // Append all the stats to the parent.
        $("#current-stats").append(temp);
        $("#current-stats").append(hum);
        $("#current-stats").append(wind);
        $("#current-stats").append(uv);
    }

    function addCardsForFiveDayForecast (apiData)
    {
        $('#forecast-container').empty();
            // For the 5 day forecast.
            for (let i = 4; i < apiData.list.length; i = i + 8) 
            {
                // Save the iteration in a var.
                var itr = apiData.list[i];

                // Set up the card.
                var cardDiv = $('<div>');
                cardDiv.addClass("card text-white bg-primary mr-3");
                cardDiv.attr('style', 'max-width: 11rem;');

                // Append items to the card.
                var cardBody = $("<div>");
                cardBody.addClass("card-body");

                // Set up the header.
                var cardHeader = $('<h5>');
                cardHeader.addClass('card-title');
                cardHeader.text(cropDateFromTime(apiData.list[i].dt_txt));

                // Set up the information.
                var cardInfo = $('<p>');
                cardInfo.addClass('card-text');
                cardInfo.html("Temperature: " + kelvinToFahrenheit(apiData.list[i].main.temp) + " ℉" + "<br>" + "Humidity: " + apiData.list[i].main.humidity + "%");

                // Append card to parent.
                cardDiv.append(cardBody);
                cardBody.append(cardHeader);
                cardBody.append(cardInfo);
                $('#forecast-container').append(cardDiv);
            }
    }

    function addCityToHistoryPanel (cityName)
    {
        var repeatName = false;
        var repeatedElement;

        pastCities.children().each( (index, element) => 
        {
            // Compare the current element to the new city we are calling.
            if($(element).text() == cityName)
            {
                // Flag that we have found a repeat name.
                repeatName = true;

                // Store the element in a var for later use.
                repeatedElement = $(element);

                // Remove it from the list.
                $(element).remove();
            }
        });

        if(!repeatName)
        {
            // Make a new button.
            var currentCity = $('<button type="button" class="list-group-item list-group-item-action">');

            // Add an on Click event to the history buttons.
            currentCity.click(function() 
            {
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

            saveCityIntoHistory(cityName);

        }
        else
        {
            // Move the name to the top of the list.
            pastCities.prepend(repeatedElement);
        }
    }

    function loadCitiesFromHistory ()
    {
        var pastCitiesArray = loadCitiesFromStorage();
        if(pastCitiesArray)
        {
            pastCitiesArray.forEach((item, index)=>
            {
                addCityToHistoryPanel(item);
            });
        }
    }

    // For loading from persistent data/
    function loadCitiesFromStorage ()
    {
        var loadedString = localStorage.getItem('pastSearches');
        if(loadedString)
        {
            var cityArray = loadedString.split(',');
            return cityArray;
        }
        else
        {
            return;
        }
    }
    // For saving to persistent data.
    function saveCityIntoHistory (cityName)
    { 
        var cityArray = loadCitiesFromStorage();
        
        if(cityArray != null)
        {
            if(!cityArray.includes(cityName))
            {
                localStorage.setItem('pastSearches', cityArray  + "," + cityName);
            }
        }
        else
        {
            localStorage.setItem('pastSearches', cityName);
        }
    }

    // Helper function to convert Kelvin to Fahrenheit
    function kelvinToFahrenheit (kelvin)
    {
        var f = Math.round(((kelvin-273.15)*1.8)+32);
        return f;
    }

    // Helper function to cut the time off of the api date return.
    function cropDateFromTime (fullString)
    {
        return fullString.split(" ")[0];
    }
};