from carriers.fedex import Fedex
from carriers.ups import UPS
from carriers.usps import USPS

from flask_restful import output_json, Resource

class PackdashApp(Resource):
    def get(self, carrier):
        if carrier == "fedex":
            pass
        elif carrier == "ups":
            pass
        elif carrier == "usps":
            pass
        else:
            return self.output_json({ "error": "bad carrier type given" }, 400)

    def output_json(self, data, code):
        '''
        Wrapper function for flask_restful's output_json function so that it is
        not necessary to always explicitly define content headers.
        '''
        return output_json(data, code, headers = {"Content-type": "application/json"})
