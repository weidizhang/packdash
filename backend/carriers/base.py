import mapquest.geocode as geocode
import util.misc as util

class Base:
    def _parse_locations_base(self, locations, locations_events):
        # Removes the duplicates and attaches geolocation data from our tracking data

        util.remove_duplicates(locations)
        return [
            {
                "eventText": "{} - {}".format(locations_events[location], location),
                "position": geocode.location_to_latlng(location) 
            }
            for location in locations
        ][::-1] # Reversed ordering so marker ordering / numbering goes in order of least recent->most recent
