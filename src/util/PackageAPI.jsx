class PackageAPI
{
    getTrackingData(tracking, carrier)
    {
        const endpoint = "./carrier/" + carrier.toLowerCase();

        // Return a promise to fetch the tracking data; it will be handled by the redux action
        return fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackingNumber: tracking })
        });
    }
}

export const packageAPI = new PackageAPI();
