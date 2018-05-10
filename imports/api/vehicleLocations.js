import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import { HTTP } from 'meteor/http';


Meteor.methods({
    "vehicles.get"(agency) {
        try {
            const res = HTTP.get(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=${agency}&t=0`);
            return res.data.vehicle;
        } catch (error) {
            throw new Meteor.Error('oops', 'something broke');
        }
    }

});
