import json
import mapquest.config as config
import requests

ENDPOINT = "http://open.mapquestapi.com/geocoding/v1/address"

def location_to_latlng(location):
    response = requests.get(ENDPOINT, params = { "key": config.MAPQUEST_APP_KEY, "location": location })
    if not response:
        return False

    data = response.json()
    if "results" in data and len(data["results"]) > 0 and len(data["results"][0]["locations"]) > 0:
        first_result = data["results"][0]["locations"][0]
        lat_lng = first_result["displayLatLng"]
        return [ lat_lng["lat"], lat_lng["lng"] ]

    return False 
