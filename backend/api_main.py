from flask import Flask
from flask_restful import Api

from PackdashApp import PackdashApp

def main():
    app = Flask(__name__)
    api = Api(app)

    api.add_resource(PackdashApp, "/carrier/<string:carrier>")
    app.run(debug = True, port = 4000)

if __name__ == "__main__":
    main()
