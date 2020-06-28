class PackageAPI
{
    getTrackingData(carrier, tracking, callback)
    {
        fetch("./api/" + carrier, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "trackingNum=" + tracking
        })
            .then( (response) => response.json() )
            .then( (data) => callback(data) )
            .catch( () => callback(false) );
    }
}

export const packageAPI = new PackageAPI();
