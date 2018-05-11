import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import { HTTP } from 'meteor/http';


Meteor.methods({
    "vehicles.get"(agency) {
        try {
            const res = HTTP.get(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=${agency}&t=0`);
            if (!res.data.vehicle) return "";
            return res.data.vehicle;
        } catch (error) {
            return "";
        }
    },
    "routes.get"(agency){
        try {
            const res = HTTP.get(`http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=${agency}`);
            if (!res) return "";
            return res;
        } catch (error) {
            return "";
        }
    }


});
