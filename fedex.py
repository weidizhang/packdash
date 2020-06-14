import json
import requests

class Fedex:
    def track(self, num):
        data = self._fetch(num).decode("utf-8")
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

        # For Fedex, we can use the provided status text string
        status = package["keyStatus"]
        activities = self._format_activities(package["scanEventList"])

        return {
            "status": status,
            "lastUpdate": activities[0],
            "previousDetails": activities[1:]
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
        return res.content

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
