const nombreCiudad = document.querySelector("#nombreCiudad")
const contenedor = document.querySelector("#contenedor")
const borderUv = document.querySelector("#borderUv")
const buscar = document.querySelector("#buscarCiudad")
const detalles = document.querySelector("#descripcionClima")
const pronostico = document.querySelector("#pronostico")
const uv = document.querySelector("#indiceUv")
const viento = document.querySelector("#viento")
const diario = document.querySelector("#diario")
const apiParts = ["bc17730", "56927", "6708f4b", "5e178e0", "fac16a"]
const apiKey = apiParts.join("")
const searchWrapper = document.querySelector("#searchWrapper")
const resultsWrapper = document.querySelector("#resultsWrapper")


const searchCountries = (searchText) => {
    if (searchText.length < 2) {
        resultsWrapper.innerHTML = '';
        return;
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=5&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const suggestions = data.map(city => {
                    return `
                        <div class="suggestion p-2 dark-transparent-2 rounded-4 mb-1" data-lat="${city.lat}" data-lon="${city.lon}">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="city-name">${city.name}, ${city.country}</span>
                                <span class="small text-white">${city.state || ''}</span>
                            </div>
                        </div>
                    `;
                }).join('');
                
                resultsWrapper.innerHTML = suggestions;
                
                document.querySelectorAll('.suggestion').forEach(suggestion => {
                    suggestion.addEventListener('click', () => {
                        const lat = suggestion.dataset.lat;
                        const lon = suggestion.dataset.lon;
                        const cityName = suggestion.querySelector('.city-name').textContent;
                        
                        
                        const cityData = {
                            name: cityName,
                            lat: lat,
                            lon: lon
                        };
                        localStorage.setItem('lastCity', JSON.stringify(cityData));
                        
                        buscar.value = cityName;
                        nombreCiudad.innerText = cityName;
                        resultsWrapper.innerHTML = '';
                        getApi(lat, lon);
                    });
                });
                } else {
                    resultsWrapper.innerHTML = '<div class="p-2 dark-transparent-2 rounded-4">No results found</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsWrapper.innerHTML = '<div class="p-2 dark-transparent-2 rounded-4">Error al obtener resultados</div>';
        });
};


buscar.addEventListener('input', (e) => {
    const searchText = e.target.value.trim();
    searchCountries(searchText);
});

document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target)) {
        resultsWrapper.innerHTML = '';
    }
});

const getApi = (lat = -34.61, lon = -58.38) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=bc17730569276708f4b5e178e0fac16a`


    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            const hora = new Date((data.current.dt + data.timezone_offset) * 1000).getUTCHours()
            const clima = data.current.weather[0].main.toLowerCase()

            mostrarDetalles(data.current, data.daily[0], )
            mostrarClimaHora(data.hourly)
            mostrarIndiceUV(data.current)
            mostrarViento (data.current)
            background(hora, clima)
        }
        )
}


const mostrarViento = (current) => {
    let valor = `
    <div class="d-flex align-items-center border-bottom">
        <h2 class="fs-1">
            ${Math.round(current.wind_speed)}
        </h2>
        <p class="mx-2 text-transparent">KMH <br> <span class="text-white fs-6">VELOCIDAD</span></p>
    </div>

    <div class="d-flex align-items-center mt-2">
        <h2 class="fs-1">
            ${Math.round(current.wind_gust)}
        </h2>
        <p class="mx-2 text-transparent">KMH <br> <span class="text-white fs-6">RAFAGAS</span></p>
    </div>
    `
    viento.innerHTML = valor
}

const mostrarIndiceUV = (current) => {
    let niveles = nivelesUv(current.uvi)
    let valor = `
        <div class="d-flex">
            <h2 class="fs-1">${current.uvi}</h2>
            <p class="fs-4 mx-4">${nivelesUv(current.uvi)}</p>
        </div>

        <div class="text-start">
            <p class="fs-6 text-trans mx-4">${mensajeUv(nivelesUv(current.uvi))}</p>
        </div>
    `
    uv.innerHTML = valor
    barraUv(niveles)
}

const mostrarClimaHora = (current) => {
    let valor = ""

    current.forEach(el => {
        const hora = new Date(el.dt * 1000).getUTCHours()
        const icono = el.weather[0].icon
        valor += `
            <div class="dark-transparent rounded-4 mx-3 p-3 my-2 text-center h-100">
                ${hora}:00 <span class="fs-3">${Math.round(el.temp)}°C</span> <img src="https://openweathermap.org/img/wn/${icono}@2x.png" class="img-fluid" alt="Icono del clima">
            </div>
        `
    });

    diario.innerHTML = valor
}

const mostrarDetalles = (current, daily) => {
    const icono = current.weather[0].icon
    const descripcion = current.weather[0].description
    const temp = Math.round(current.temp)
    const feelsLike = Math.round(current.feels_like)
    const humedad = current.humidity
    const presion = current.pressure
    const summary = daily.summary
    const min = Math.round(daily.temp.min)
    const max = Math.round(daily.temp.max)
    const amanecer = new Date(current.sunrise * 1000).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
    const atardercer = new Date(current.sunset * 1000).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })


    let valor = `
    <div class="text-center">
        <h1 id="nombreCiudad" class="py-3"></h1>
    </div>
    <div class="d-flex align-items-center justify-content-lg-between">
            <img src="https://openweathermap.org/img/wn/${icono}@2x.png" alt="Icono del clima">
            <h1 class="mt-2">${temp}°C</h1>
            <h2 class="text-end mt-2">${descripcion}</h2>
    </div>

    <div class="text-center py-3">
        <p class="fs-4">${summary}</p>
    </div>

        <div class="row">
            <div class="col-lg-12 dark-transparent-2 rounded-4 mx-3 mb-3 d-flex justify-content-around">
                <p class="bi bi-thermometer-half my-2 fs-5"> Sensación térmica de ${feelsLike}°C</p>
                <p class="pt-3">${max}/${min}</p>
            </div>

            <div class="col-lg-12 dark-transparent-2 rounded-4 mx-3 mb-3">
                <div class="d-flex justify-content-between border-bottom">
                    <h2 class="bi bi-moisture fs-1 pt-2 text-primary"> <span class="fs-3 text-white">Humedad</span></h2>
                    <h3 class="pt-3">${humedad}%</h3>
                </div>
                <div class="d-flex justify-content-between border-bottom">
                    <h2 class="bi bi-thermometer fs-1 pt-2"> <span class="fs-3 text-white">Presion</span></h2>
                    <h3 class="pt-3">${presion}</h3>
                </div>
                <div class="d-flex justify-content-between border-bottom">
                    <h2 class="bi bi-sunrise text-warning fs-1 pt-2"> <span class="fs-3 text-white">Amanecer</span></h2>
                    <h3 class="pt-3">${amanecer}</h3>
                </div>
                <div class="d-flex justify-content-between border-bottom">
                    <h2 class="bi bi-sunset text-danger fs-1 pt-2"> <span class="fs-3 text-white">Atardecer</span></h2>
                    <h3 class="pt-3">${atardercer}</h3>
                </div>
            </div>
        </div>
    `
    detalles.innerHTML = valor
}

const background = (i, weather) => {
    const isDaytime = i >= 8 && i < 17;
    
    const backgroundMap = {
        clear: {
            day: "url(./images/backgroundDia.png)",
            night: "url(./images/backgroundNoche.png)"
        },
        clouds: {
            day: "url(./images/backgroundNuboso.png)",
            night: "url(./images/backgroundNocheNuboso.png)"
        },
        rain: {
            day: "url(./images/backgroundDiaLluvia.png)",
            night: "url(./images/backgroundNocheLluvia.png)"
        },
        snow: {
            day: "url(./images/backgroundDiaNieve.png)",
            night: "url(./images/backgroundNocheNieve.png)"
        },
        drizzle: {
            day: "url(./images/backgroundDiaLluvia.png)",
            night: "url(./images/backgroundNocheLluvia.png)"
        },
        thunderstorm: {
            day: "url(./images/backgroundDiaThunder.png)",
            night: "url(./images/backgroundNocheThunder.png)"
        },
        sand: {
            day: "url(./images/backgroundDiaArena.png)",
            night: "url(./images/backgroundNoche.png)"
        }
    };

    const timeOfDay = isDaytime ? 'day' : 'night';
    const backgroundImage = backgroundMap[weather]?.[timeOfDay];

    if (backgroundImage) {
        document.body.style.backgroundImage = backgroundImage;
    } else {
        document.body.style.backgroundImage = "url(./images/backgroundDia.png)";
        console.log("No se pudo cambiar el bg - Clima:", weather);
    }
}

const nivelesUv = (uv) => {
    if (uv <= 2) return `Bajo`
    if (uv >= 3 || uv <= 5) return `Moderado`
    if (uv >= 6 || uv <= 7) return `Alto`
    if (uv >= 8 || uv <= 10) return `Muy alto`
    return `Extremadamente alto`
}

const mensajeUv = (f) => {
    if (f == `Bajo`) return `<div>Protección mínima</div>`
    if (f == `Moderado`) return `<div>Sombrero, gafas, protector solar</div>`
    if (f == `Alto`) return `<div>Evitar sol del mediodía, protección</div>`
    if (f == `Muy alto`) return `<div>Buscar sombra, usar ropa de cobertura</div>`
    if (f == `Extremadamente alto`) return `<div>Evitar exposición directa al sol</div>`
}

const barraUv = (uv) => {
    //console.log(uv)
    switch (uv) {
        case "Bajo":
            borderUv.style.border = "4px solid rgb(127, 240, 255)"
            break;
        case "Moderado":
            borderUv.style.border = "4px solid rgb(148, 255, 127)"
            break;
        case "Alto":
            borderUv.style.border = "4px solid rgb(255, 242, 127)"
            break;
        case "Muy alto":
            borderUv.style.border = "4px solid rgb(255, 127, 127)"
            break;
        case "Extremadamente alto":
            borderUv.style.border = "4px solid rgb(159, 58, 226)"
            break;
        default:
            borderUv.style.border = "4px solid grey"
            break;
    }
}

const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
    const cityData = JSON.parse(lastCity);
    nombreCiudad.innerText = cityData.name;
    buscar.value = cityData.name;
    getApi(cityData.lat, cityData.lon);
} else {
    getApi();
}