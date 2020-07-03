import json
import mapquest.config as config
import requests
import us

ENDPOINT = "http://open.mapquestapi.com/geocoding/v1/address"
STATE_MAPPING = us.states.mapping("abbr", "name")

def expand_location_name(location):
    #! Mapquest API has issues with correctly determining location if the country
    #! is not given in the location string and there is no zip code
    #! 
    #! Can account for this by converting states to their full name, i.e. CA -> California
    #! Also need to note that the country is USA if a mapping was successful to aid Mapquest
    location_parts = location.split()

    for i in range(len(location_parts)):
        expanded = False
        part = location_parts[i]

        # Only parts of the location with two letters can possibly be a state abbreviation
        if len(part) == 2:
            for abbr, full_name in STATE_MAPPING.items():
                if abbr == part:
                    location_parts[i] = full_name
                    expanded = True
                    break

        if expanded:
            location_parts.append("United States")
            break

    return " ".join(location_parts)

def location_to_latlng(location):
    location = expand_location_name(location)
    response = requests.get(ENDPOINT, params = { "key": config.MAPQUEST_APP_KEY, "location": location })
    if not response:
        return False

    data = response.json()
    if "results" in data and len(data["results"]) > 0 and len(data["results"][0]["locations"]) > 0:
        first_result = data["results"][0]["locations"][0]
        lat_lng = first_result["displayLatLng"]
        return [ lat_lng["lat"], lat_lng["lng"] ]

    return False 
