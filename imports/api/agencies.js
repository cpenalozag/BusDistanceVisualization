import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";

export const Agencies = new Mongo.Collection("agencies");

if (Meteor.isServer) {
    Meteor.publish("Agencies", () => {
        return Agencies.find({});
    });
}
