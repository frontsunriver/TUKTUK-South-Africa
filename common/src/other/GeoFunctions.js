import { getDriveTime } from './GoogleAPIFunctions';
export const GetDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
};

export const GetTripDistance = async (data) => {
    if (data) {
        const arr = Object.keys(data)
            .filter(function (i) {
                return data[i].status == 'STARTED' || data[i].status == 'REACHED'
            })
            .map(i => {
                data[i].id = i
                return data[i]
            });
        let distance = 0;
        let coords = [];
        try{
            if (arr.length == 0 || arr.length == 1) {
                distance = 0;
            } else if (arr.length == 2) {
                let startLoc =  arr[0].lat + ',' + arr[0].lng;
                let destLoc =  arr[1].lat + ',' + arr[1].lng;
                let res = await getDriveTime(startLoc,destLoc);
                distance = res.distance_in_km;
                coords.push({latitude : arr[0].lat, longitude : arr[0].lng});
                coords.push({latitude : arr[1].lat, longitude : arr[1].lng});
            } else {
                let origins = '';
                let gaptokeep = 1;
                if(arr.length>25){
                    gaptokeep = parseInt(arr.length / 25) + 1;
                }
                for (let i = 0; i < (arr.length - 1); i++) {
                    if(i%gaptokeep == 0){
                        origins = origins + arr[i].lat + ',' +  arr[i].lng;
                        if(i < arr.length - 2){
                            origins = origins + '|';
                        }
                    }
                    coords.push({latitude : arr[i].lat, longitude : arr[i].lng});
                }
                coords.push({latitude : arr[arr.length - 1].lat, longitude : arr[arr.length - 1].lng});
                let res = await getDriveTime(origins,arr[arr.length - 1].lat + ',' + arr[arr.length - 1].lng);
                distance = res.distance_in_km;
            }
        }catch(error){
            console.log(error);
        }
        return {
            distance:distance ,
            coords: coords
        };
    }
    else {
        return {
            distance:0,
            coords:[]
        };
    }
}

