from http.server import BaseHTTPRequestHandler, HTTPServer

import json
import config

class WebInterface(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/test":
            self._send_json_response( {} )
        else:
            self._send_forbidden()

    def _send_json_response(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

        self.wfile.write( json.dumps(data).encode("utf-8") )

    def _send_forbidden(self):
        self.send_response(403)
        self.end_headers()

def main():
    print("Starting server ...")

    httpd = HTTPServer( ("", config.http_port), WebInterface )
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    print("Shutting down server ...")
    httpd.server_close()

if __name__ == "__main__":
    main()
