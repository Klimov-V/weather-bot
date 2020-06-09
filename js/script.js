(() => {
    'use strict'

    const WEATHER_API_KEY = "84c70da779998d3b41baaa052fff701e",
          URL             = "https://api.openweathermap.org/data/2.5/weather?q=",
          TELEGRAM_URL    = "https://api.telegram.org/bot",
          TELEGRAM_KEY    = "970610698:AAHf6VxKuSoSrzBoobd78ymVBPdllLozGzQ",
          TELEGRAM_BOT_ID = "970610698",
          TELEGRAM_CHANEL_ID = "-1001392957923";




    function getWeather(city) {
        return fetch(`${URL}${city}&appid=${WEATHER_API_KEY}&lang=ru&units=metric`)
               .then(response => response.json())
    }

    function postWeather(message) {
        let params = {
            'chat_id' : TELEGRAM_CHANEL_ID,
            'params_mode' : 'html',
            'text' : encodeURI(message),
            'reply_markup' : JSON.stringify({
                'inline_keyboard' : [
                    [{
                        'text' : 'Test',
                        'callback_data' : 'Test'
                    },
                    {
                        'text' : 'Test2',
                        'callback_data' : 'Test2'
                    }]
                ]
            })
        };
        params = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        console.log(params);
        
        return fetch(`${TELEGRAM_URL}${TELEGRAM_KEY}/sendMessage?${params}`);
    }

    let btns  = document.querySelectorAll('.btn'),
        title = document.querySelector('#target');

    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let city = e.target.innerText;

            getWeather(city).then(result => {
                console.log(result);

                let offset  = (new Date()).getTimezoneOffset(),
                    sunrise = new Date(result.sys.sunrise * 1000),
                    sunset  = new Date(result.sys.sunset * 1000);

                sunrise.setMinutes(sunrise.getMinutes() + offset);
                sunset.setMinutes(sunrise.getMinutes() + offset);
                
                sunrise.setSeconds(sunrise.getSeconds() + result.timezone);
                sunset.setSeconds(sunset.getSeconds() + result.timezone);

                sunrise = `${('0' + sunrise.getHours()).slice(-2)}:${('0' + sunrise.getMinutes()).slice(-2)}`
                sunset = `${('0' + sunset.getHours()).slice(-2)}:${('0' + sunset.getMinutes()).slice(-2)}`
                

                let text = "Виталик\n" + result.name + ":\nТемпература: " + result.main.temp + "\nОщущается как "
                            + result.main.feels_like + ", " + result.weather[0].description + '.\nСкорость ветра '
                            + result.wind.speed + " м/с.\nРассвет в " + sunrise + ", закат в " + sunset + ".";
                
                // `Виталик: 
                //             ${result.name}: ${result.main.temp}, 
                //             ощущается как ${result.main.feels_like}, 
                //             ${result.weather[0].description}.
                //             Скорость ветра ${result.wind.speed} м/с.
                //             Рассвет в ${sunrise}, закат в ${sunset}`;

                title.innerHTML = text;

                postWeather(text);
            });
        });
    });


    
 
})();