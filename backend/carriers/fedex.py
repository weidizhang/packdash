import mapquest.geocode as geocode
import json
import requests
import util.misc as util

class Fedex:
    def track(self, num):
        data = self._fetch(num)
        if not data:
            return False

        data_json = json.loads(data)["TrackPackagesResponse"]
        # Check for error with API response
        if not data_json["successful"] or len(data_json["errorList"]) > 1 or data_json["errorList"][0]["code"] != "0":
            return False

        package = data_json["packageList"][0]
        # Check if the tracking code is valid
        if not package["trackingQualifier"]:
            return False

        activities = self._format_activities(package["scanEventList"])

        # For Fedex, we can use the provided status text string, UNLESS it is out
        # for delivery, as the keyStatus will be 'In transit'
        status = "Out for Delivery" if "for delivery" in activities[0] else package["keyStatus"]

        return {
            "lastUpdate": activities[0],
            "locationMarkers": self._parse_locations(package["scanEventList"]),
            "previousDetails": activities[1:],
            "status": status
        }

    def _fetch(self, num):
        endpoint = "https://www.fedex.com/trackingCal/track"
        post_json = {
            "TrackPackagesRequest": {
                "appType": "WTRK",
                "appDeviceType": "DESKTOP",
                "supportHTML": True,
                "supportCurrentLocation": True,
                "uniqueKey": "",
                "processingParameters": {},
                "trackingInfoList":[
                    {
                        "trackNumberInfo": {
                            "trackingNumber": num,
                            "trackingQualifier": "",
                            "trackingCarrier": ""
                        }
                    }
                ]
            }
        }
        params = {
            "data": json.dumps(post_json),
            "action": "trackpackages",
            "locale": "en_US",
            "version": "1",
            "format": "json"
        }

        res = requests.post(endpoint, params = params)
        return res.text

    def _format_activities(self, activities):
        def pretty_activity(activity):
            display_str = "{} {}, {}: {}" if activity["scanLocation"] else "{} {}{}: {}"
            return display_str.format(
                activity["date"],
                activity["time"],
                activity["scanLocation"],
                activity["status"]
            )
        return list( map(pretty_activity, activities) )

    def _parse_locations(self, activities):
        #! For implementation comments, see usps.py.

        locations = []
        locations_events = {}

        # Always need to exclude the first chronological status text in FedEx
        # as it provides no location info
        for activity in activities[:-1]:
            location = activity["scanLocation"]
            locations.append(location)

            if location not in locations_events:
                locations_events[location] = activity["status"]

        util.remove_duplicates(locations)
        return [
            {
                "eventText": "{} - {}".format(locations_events[location], location),
                "position": geocode.location_to_latlng(location) 
            }
            for location in locations
        ][::-1]
