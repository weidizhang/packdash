import mapquest.geocode as geocode
import xmltodict
import requests
import util.misc as util

class Status:
    STATUS_ACCEPTED = "Accepted"
    STATUS_DELIVERED = "Delivered"
    STATUS_IN_TRANSIT = "In Transit"
    STATUS_OUT_FOR_DELIVERY = "Out for Delivery"

class USPS:
    def __init__(self, user_id):
        self.uid = user_id

    def track(self, num):
        # Test for error with response or error with parsing
        try:
            data = xmltodict.parse(self._fetch(num))
        except Exception:
            return False

        track_info = data["TrackResponse"]["TrackInfo"]

        # Bad tracking code
        if "Error" in track_info:
            return False

        # Parse and organize the information
        summary = track_info["TrackSummary"]

        detail_texts = []
        if "TrackDetail" in track_info and len(track_info["TrackDetail"]) > 0:
            detail_texts = self._format_activities(track_info["TrackDetail"])

        merged_details = [ summary ]
        merged_details.extend(track_info["TrackDetail"])

        return {
            "lastUpdate": self._format_activities([ summary ])[0],
            "locationMarkers": self._parse_locations(merged_details),
            "previousDetails": detail_texts,
            "status": self._format_status(summary["Event"])
        }

    def _fetch(self, num):
        endpoint = "https://secure.shippingapis.com/ShippingAPI.dll"
        xml_template = '<TrackFieldRequest USERID="{}"><TrackID ID="{}"></TrackID></TrackFieldRequest>'
        params = {
            "API": "TrackV2",
            "XML": xml_template.format(self.uid, num)
        }

        res = requests.get(endpoint, params = params)
        return res.text

    def _format_activities(self, track_info):
        activities = []
        for detail in track_info:
            format_str = "{Event}, {EventDate}, {EventTime}, {EventCity}, {EventState} {EventZIPCode}" \
                            if detail["EventState"] else "{Event}, {EventDate}, {EventTime}, {EventCity}"
            activities.append(format_str.format(**detail))
        return activities

    def _format_status(self, event):
        mapping = {
            "Delivered": Status.STATUS_DELIVERED,
            "Out for Delivery": Status.STATUS_OUT_FOR_DELIVERY,
            "Accepted": Status.STATUS_ACCEPTED,
            "Arrived": Status.STATUS_IN_TRANSIT,
            "Departed": Status.STATUS_IN_TRANSIT
        }
        for key, status in mapping.items():
            if key in event:
                return status

        #! Do not simplify the event / status info if we don't have a mapping
        return event

    def _parse_locations(self, track_info):
        locations = []
        locations_events = {}

        for detail in track_info:
            location = None

            if detail["EventState"]:
                location = "{EventCity}, {EventState} {EventZIPCode}".format(**detail)
            elif detail["EventCity"] and "DISTRIBUTION CENTER" in detail["EventCity"]:
                location = detail["EventCity"][:-len(" DISTRIBUTION CENTER")]

            if location:
                locations.append(location)

                # Using a separate tracker for events simplifies the process of removing duplicates
                # significantly and will always reflect the "last" event that the occured at a location
                # as we know the track_info list order goes from most recent->least recent
                if location not in locations_events:
                    locations_events[location] = self._format_status(detail["Event"])

        util.remove_duplicates(locations)
        return [
            {
                "eventText": "{} - {}".format(locations_events[location], location),
                "position": geocode.location_to_latlng(location) 
            }
            for location in locations
        ][::-1] # Reversed ordering so marker ordering / numbering goes in order of least recent->most recent
