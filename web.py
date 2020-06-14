from http.server import SimpleHTTPRequestHandler
from urllib import parse

from fedex import Fedex
from usps import USPS
from ups import UPS

import config
import json

class WebInterface(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory = "./frontend/", **kwargs)

    def do_POST(self):
        found_api = False

        # Valid paths:
        #
        # /api/fedex
        # /api/ups
        # /api/usps
        #
        # Accepts parameter "trackingNum" in the post body

        if self.path[:5] == "/api/":
            carrier = self.path[5:]
            mapping = {
                "fedex": Fedex(),
                "ups": UPS(),
                "usps": USPS(config.usps_key)
            }
            
            if carrier in mapping:
                found_api = True
                api = mapping[carrier]

                content = self.rfile.read(int(self.headers["Content-Length"]))
                content = parse.parse_qs(field_data)
                if "trackingNum" in content:
                    self.send_json_response(carrier.track(content["trackingNum"]))
                else:
                    self.send_json_response({ "error": "bad data" })

        if not found_api:
            super().do_POST()

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        self.wfile.write(json.dumps(data).encode("utf-8"))

    def send_forbidden(self):
        self.send_response(403)
        self.end_headers()
