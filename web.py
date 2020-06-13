from http.server import SimpleHTTPRequestHandler

import json

class WebInterface(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory = "./frontend/", **kwargs)

    def do_GET(self):
        if self.path == "/api/test":
            self.send_json_response( {} )
        else:
            super().do_GET()

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        self.wfile.write( json.dumps(data).encode("utf-8") )

    def send_forbidden(self):
        self.send_response(403)
        self.end_headers()
