class PackageAPI
{
    getTrackingData(tracking, carrier)
    {
        // Return a promise to fetch the tracking data; it will be handled by the redux action
        return fetch("./api/" + carrier, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "trackingNum=" + tracking
        });
    }
}

export const packageAPI = new PackageAPI();
