const express = require('express');
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config()
const DATA_FILE = path.join(__dirname, '/artist-nationality.json');
const countryCodes = require('./countries.json');
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), 'utf8');

const queue = [];
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client/build')));

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const localDataExists = (key) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8'); // Read the file synchronously
        const value = JSON.parse(data)[key];        
        if(!value) return null;
        return value;
    } catch (error) {
        console.error(error);
        return null;
    }
}
const setLocalData = (pair) => {
    try {
        let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); // Read the file synchronously
        data = {...data, ...pair};
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return;
    } catch (error) {
        console.error('Error reading/writing JSON file:', error);
        return;
    }
}

const getNationalityLocally = async(artist) => {
    return localDataExists(artist);    
}

const getCityCountryCode = async(city, artist) => {
    try {
        if(!city) return null;
        const key = process.env.GEOCODE_API_KEY;
        console.log(new Date(), `\t - ${artist} - Checking geocode - https://geocode.maps.co/search?q=${city}`);        
        const response = await fetch("https://geocode.maps.co/search?q="+ city +"&api_key="+key, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        const { lat, lon } = json[0];
        await delay(1000);
        console.log(new Date(), `\t - ${artist} - Checking geocode - https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`);        
        const response2 = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${key}`, {
            method: "GET",
        });
        if (!response2.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json2 = await response2.json();
        const countryCode = json2.address.country_code;
        return countryCode
    } catch (error) {
        console.error(error);
        return null;
    }   
}

const getNationalityRemotely = async(artist) => {
    try {
        console.log(new Date(), `- ${artist} - Checking musicbrainz - https://musicbrainz.org/ws/2/artist?query=${artist}`);        
        let headers = new Headers({
            "User-Agent"   : "playlistduration/1.0.0 (craigrobertson99@gmail.com)"
        });
        const response = await fetch("https://musicbrainz.org/ws/2/artist?query="+artist+"&fmt=json", {
            method: "GET",
            headers
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        let nationality = json.artists[0]?.country;
        if(!nationality) {
            const type = json.artists[0]?.area?.type;
            const name = json.artists[0]?.area?.name;
            if(type === 'Country') nationality = countryCodes[json.artists[0]?.area?.name];
            else if(type === 'City') nationality = await getCityCountryCode(name, artist);
            else nationality = await getCityCountryCode(name, artist);
        }
        return { artist, code: (nationality || "-").toUpperCase() };
    } catch (error) {
        console.error(error);
        return null;
    }
}

setInterval(() => {
    processQueue();
}, 1250)

const processQueue = async() => {
    if (queue.length === 0) return; // Already processing or queue is empty
    const { resolve, reject, artist } = queue.shift();
    try {
        const nationality = await getNationalityRemotely(artist);        
        if(!nationality) resolve({artist, code: "-"});
        resolve(nationality);
    } catch (error) {
        reject(error);
    }
}

app.post("/artists/nationality", async(req, res) => {
    const data = {};
    const promises = [];    
    for(const artist of (req.body || [])) {
        const nationality = await getNationalityLocally(artist);
        if(!nationality) {
            const requestPromise = new Promise((resolve, reject) => {
                queue.push({ artist, resolve, reject });
            });
            promises.push(requestPromise);
        }
        data[artist] = nationality ;
    }
    Promise.allSettled(promises).then((results) => {        
        results.forEach((result) => {
            data[result.value.artist] = result.value.code;
        });
        setLocalData(data);
        return res.status(200).json(data);
    });
    return;
});

app.get('*', (req, res) => {
    res.redirect('/')
});

app.listen(port, () => console.log(`server started on port ${port}`));