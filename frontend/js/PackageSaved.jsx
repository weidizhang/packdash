class PackageSaved
{
    // We know that tracking numbers are always unique
    // --> So we don't have to force names to always be unique
    // Using ( key = tracking, value = object with data )
    addItem = (tracking, carrier, name) =>
                    localStorage.setItem(tracking, JSON.stringify({ carrier: carrier, name: name }));

    getAll = () => Object.entries(localStorage);
    
    isSaved = (tracking) => localStorage.getItem(tracking) !== null;

    removeItem = (tracking) => localStorage.removeItem(tracking);
}
