from http.server import HTTPServer
from web import WebInterface

import config

def main():
    print("Starting packdash server ...")
    httpd = HTTPServer(("", config.http_port), WebInterface)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    print("Shutting down server ...")
    httpd.server_close()

if __name__ == "__main__":
    main()
