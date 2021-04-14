import { Google_Map_Key } from 'config';
import {
    cloud_function_server_url
} from 'config';

export const fetchCoordsfromPlace = async (place_id) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + place_id + '&key=' + Google_Map_Key);
    const json = await response.json();
    if (json.results && json.results.length > 0 && json.results[0].geometry) {
        let coords = json.results[0].geometry.location;
        return coords;
    }
    return null;
}

export const fetchAddressfromCoords = async (latlng) => {
    const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + Google_Map_Key)
    const json = await response.json();
    if (json.results && json.results.length > 0 && json.results[0].formatted_address) {
        return json.results[0].formatted_address;
    }
    return null;
}

export const getRouteDetails = async (startLoc, destLoc) => {
    let response = await fetch(`${cloud_function_server_url}/get_route_details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "start": startLoc,
            "dest": destLoc,
            "google_map_key": Google_Map_Key
        })
    });
    let json = await response.json();
    if (json.distance) {
        return json;
    }else{
        console.log(json.error);
    }
    return null;
}

export const getDriveTime = (startLoc, destLoc) =>{
    return new Promise(function (resolve, reject) {
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLoc}&destinations=${destLoc}&key=${Google_Map_Key}`)
            .then((response) => response.json())
            .then((res) =>
                resolve({
                    distance_in_km: res.rows[0].elements[0].distance.value / 1000,
                    time_in_secs: res.rows[0].elements[0].duration.value,
                    timein_text: res.rows[0].elements[0].duration.text
                })
            )
            .catch(error => {
                reject(error);
            });
    });
}