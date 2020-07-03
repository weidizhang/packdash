from carriers.base import Base

import json
import requests

class UPS(Base):
    def track(self, num):
        data = self._fetch(num)
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
            "lastUpdate": activities[0],
            "locationMarkers": self._parse_locations(details["shipmentProgressActivities"]),
            "previousDetails": activities[1:],
            "status": status
        }

    def _fetch(self, num):
        endpoint = "https://www.ups.com/track/api/Track/GetStatus?loc=en_US"
        post_json = {
            "Locale": "en_US",
            "TrackingNumber": [num],
            "Requester": "wt/trackdetails"
        }

        res = requests.post(endpoint, json = post_json)
        return res.text

    def _fix_case(self, s):
        return s.strip() if s != s.upper() else s[0].upper() + s[1:].lower().strip()

    def _format_activities(self, activities):
        def pretty_activity(activity):
            return "{} {}, {}: {}".format(
                activity["date"],
                activity["time"],
                activity["location"],
                self._fix_case(activity["activityScan"])
            )
        return list( map(pretty_activity, activities) )

    def _parse_locations(self, activities):
        #! For implementation comments, see usps.py.

        # For UPS only, we exclude the first chronological status if there is more than
        # one activity, as it is always the country of origin
        if len(activities) > 0:
            activities = activities[:-1]

        locations = []
        locations_events = {}

        for activity in activities:
            location = activity["location"]
            locations.append(location)

            if location not in locations_events:
                locations_events[location] = self._fix_case(activity["activityScan"])

        return super()._parse_locations_base(locations, locations_events)
