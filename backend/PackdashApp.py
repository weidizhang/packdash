from carriers.fedex import Fedex
from carriers.ups import UPS
from carriers.usps import USPS

from flask_restful import output_json, Resource

import carriers.config as config

class PackdashApp(Resource):
    def __init__(self, *args, **kwargs):
        super(*args, **kwargs)

        # Initialize the different support carriers
        self.carriers = {
            "fedex": Fedex(),
            "ups": UPS(),
            "usps": USPS(config.usps_key)
        }

    def get(self, carrier, tracking):
        '''
        Endpoint given by GET /carrier/<string:carrier>/<string:tracking>
        '''

        if carrier in self.carriers:
            response = self.carriers[carrier].track(tracking)

            if response:
                return self.output_json(response, 200)
            return self.output_json({ "error": "bad tracking number given" }, 400)

        return self.output_json({ "error": "bad carrier type given" }, 400)

    def output_json(self, data, code):
        '''
        Wrapper function for flask_restful's output_json function so that it is
        not necessary to always explicitly define content headers.
        '''

        return output_json(data, code, headers = {"Content-type": "application/json"})
