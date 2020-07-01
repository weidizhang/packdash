class PackageAPI
{
    getTrackingData(tracking, carrier)
    {
        // The backend point is /carrier/{carrier}/{tracking}
        carrier = carrier.toLowerCase();
        const endpoint = `./carrier/${carrier}/${tracking}`;

        // Return a promise to fetch the tracking data; it will be handled by the redux action
        return fetch(endpoint, { method: "GET" });
    }
}

export const packageAPI = new PackageAPI();
