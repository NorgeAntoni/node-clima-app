const fs = require('fs');

const axios = require('axios');


class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapializado(){
        return this.historial.map( lugar =>{
            let palabras = lugar.slpit(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.subsring(1) );

            return palabras.join(' ')
        })
    }

    get ParamsMapBox() {

        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'

        }
    }

    async ciudad( lugar = ''){

        try {

            //peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.ParamsMapBox                
            });
            
            //const resp = await axios.get( `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json?access_token=pk.eyJ1Ijoibm9yZ2VhbnRvbmkiLCJhIjoiY2t5bm84ZXpyMWpwbjJvcDB6ZzNpaXcyOCJ9.-EbdpQUJbnKfThJMOfPkrw&limit=5&language=es` );

            const resp = await intance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })) ;

        } catch (error) {
            console.log(error);
        }
        
    }

    async climaLugar( lat, lon){

        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    appid : process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'es'
                }
            })

            const resp = await instance.get();
            const { weather, main} = resp.data

            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description

            }
            
        } catch (error) {
            console.log(error);
        }
    }



    agregarHistorial( lugar = '' ) {

        if ( this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,4);
        this.historial.unshift( lugar );
        //grabar en db
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify(payload) )

    }

    leerDB(){

        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );
        this.historial = data.historial;

     }
}


module.exports = Busquedas;

