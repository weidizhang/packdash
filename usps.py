import requests
import xml.etree.ElementTree as ET

class USPS:
    def __init__(self, user_id):
        self.uid = user_id

    def track(self, num):
        data = self._fetch(num).decode("utf-8")
        if not data:
            return False

        data_xml = ET.fromstring(data)
        track_summary = data_xml.find(".//TrackSummary").text
        if "could not locate" in track_summary:
            return False

        track_details = data_xml.findall(".//TrackDetail")
        detail_texts = []
        for detail in track_details:
            detail_texts.append(detail.text)

        return {
            "last_update": track_summary,
            "previous_details": detail_texts
        }

    def _fetch(self, num):
        endpoint = "https://secure.shippingapis.com/ShippingAPI.dll"
        xml_template = '<TrackRequest USERID="{}"><TrackID ID="{}"></TrackID></TrackRequest>'
        params = {
            "API": "TrackV2",
            "XML": xml_template.format(self.uid, num)
        }

        res = requests.get(endpoint, params = params)
        return res.content

    def _parse_status(self, summary):
        if "item was delivered" in summary:
            return "Delivered"
        # TODO:
