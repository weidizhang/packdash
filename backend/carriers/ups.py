import json
import requests
import util.misc as util

class UPS:
    def track(self, num):
        data = self._fetch(num).decode("utf-8")
        if not data:
            return False

        data_json = json.loads(data)
        if data_json["statusCode"] != "200" or data_json["trackDetails"][0]["errorCode"]:
            return False

        details = data_json["trackDetails"][0]

        # For UPS, we can use the provided status text string
        status = details["packageStatus"]
        activities = self._format_activities(details["shipmentProgressActivities"])

        return {
            "status": status,
            "lastUpdate": activities[0],
            "locationMarkers": self._parse_locations(details["shipmentProgressActivities"]),
            "previousDetails": activities[1:]
        }

    def _fetch(self, num):
        endpoint = "https://www.ups.com/track/api/Track/GetStatus?loc=en_US"
        post_json = {
            "Locale": "en_US",
            "TrackingNumber": [num],
            "Requester": "wt/trackdetails"
        }

        res = requests.post(endpoint, json = post_json)
        return res.content

    def _format_activities(self, activities):
        def pretty_activity(activity):
            fix_case = lambda s : s.strip() if s != s.upper() else s[0].upper() + s[1:].lower().strip()
            return "{} {}, {}: {}".format(
                activity["date"],
                activity["time"],
                activity["location"],
                fix_case(activity["activityScan"])
            )
        return list( map(pretty_activity, activities) )

    def _parse_locations(self, activities):
        locations = [ activity["location"] for activity in activities ]
        if len(locations) > 0:
            locations = locations[:-1]

        util.remove_duplicates(locations)
        return locations
