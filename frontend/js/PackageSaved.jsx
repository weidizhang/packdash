class PackageSaved
{
    // Uses (tracking, carrier) as (key, value) so that we have unique keys,
    // unlike other functions that take the parameters in order of (carrier, tracking)
    addItem = (tracking, carrier) => localStorage.setItem(tracking, carrier);

    getAll = () => Object.entries(localStorage);
    
    isSaved = (item) => localStorage.getItem(item) !== null;

    removeItem = (tracking) => localStorage.removeItem(tracking);
}
