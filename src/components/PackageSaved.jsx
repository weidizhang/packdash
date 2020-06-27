class PackageSaved
{
    // We know that tracking numbers are always unique
    // --> So we don't have to force names to always be unique
    // Using ( key = tracking, value = object with data )
    addItem = (tracking, carrier, name) =>
                    localStorage.setItem(tracking, JSON.stringify({ carrier: carrier, name: name }));

    getAll()
    {
        // Data format: [tracking, data]
        const entries = Object.entries(localStorage);

        // Sort by: first, named packages (alphabetical); then, tracking # (alphabetical)
        return entries.sort((a, b) => {
            const aData = JSON.parse(a[1]);
            const bData = JSON.parse(b[1]);

            // Both packages are named
            if (aData.name && bData.name)
                return aData.name.localeCompare(bData.name);
            
            // Only one of the packages is named
            if (aData.name || bData.name)
                return aData.name ? -1 : 1;

            // Neither package is named, so compare tracking #
            return a[0].localeCompare(b[0]);
        });
    }

    isSaved = (tracking) => localStorage.getItem(tracking) !== null;

    removeItem = (tracking) => localStorage.removeItem(tracking);
}
