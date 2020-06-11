const WEATHER_API_KEY = "84c70da779998d3b41baaa052fff701e",
      URL             = "https://api.openweathermap.org/data/2.5/weather?q=",
      TELEGRAM_URL    = "https://api.telegram.org/bot",
      TELEGRAM_KEY    = "970610698:AAHf6VxKuSoSrzBoobd78ymVBPdllLozGzQ",
      TELEGRAM_BOT_ID = "970610698",
      TELEGRAM_CHANEL_ID = "-1001392957923";

// Подключаем библиотеку для работы с Telegram API в переменную
let TelegramBot = require('node-telegram-bot-api'),
    fetch = require('node-fetch'),
    translate = require('translate');

let bot = new TelegramBot(TELEGRAM_KEY, { polling: true });

bot.on("polling_error", (err) => console.log(err));

bot.onText(/(.+)/, function (msg) {
    
    translate(msg.text, {
        from: 'ru',
        to: 'en', 
        engine: 'google', 
        key: 'AIzaSyCub7pKRDZju62_aRtGlmMtl-T1LBthZL4'
    }).then(city => {
        console.log(city);
        getWeather(city).then(result => {
            let offset  = (new Date()).getTimezoneOffset(),
                sunrise = new Date(result.sys.sunrise * 1000),
                sunset  = new Date(result.sys.sunset * 1000);
    
            sunrise.setMinutes(sunrise.getMinutes() + offset);
            sunset.setMinutes(sunrise.getMinutes() + offset);
            
            sunrise.setSeconds(sunrise.getSeconds() + result.timezone);
            sunset.setSeconds(sunset.getSeconds() + result.timezone);
    
            sunrise = `${('0' + sunrise.getHours()).slice(-2)}:${('0' + sunrise.getMinutes()).slice(-2)}`
            sunset = `${('0' + sunset.getHours()).slice(-2)}:${('0' + sunset.getMinutes()).slice(-2)}`
            
    
            let text = `<b>Виталик</b>\n` + result.name + ":\nТемпература: " + result.main.temp + "C\nОщущается как "
                        + result.main.feels_like + "C,\n" + result.weather[0].description + '.\nСкорость ветра '
                        + result.wind.speed + "м/с.\nРассвет в " + sunrise + ", закат в " + sunset + ".";
    
            bot.sendMessage(TELEGRAM_CHANEL_ID, text, {
                "parse_mode": "HTML"
            });
        });
    })

    
    
    
    
})

function getWeather(city) {
    return fetch(`${URL}${city}&appid=${WEATHER_API_KEY}&lang=ru&units=metric`)
           .then(response => response.json())
}
