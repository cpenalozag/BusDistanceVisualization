import React, {Component} from "react";
import * as d3 from "d3";

class Diagram extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.svg;
        this.state = {};
    }

    componentDidMount() {
        var svg = d3.select(this.svg),
            margin = {top: 40, left: 40, right: 40, bottom: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    }

    componentDidUpdate() {
        let nestedBuses = d3.nest().key((d) => d.routeTag).entries(this.props.data);
        this.computeDistances(nestedBuses);
        console.log(nestedBuses);
    }

    computeDistances(nestedBuses) {
        for (let route of nestedBuses) {
            route.total = 0;
            route.values[0].distance = 0;
            for (let i = 1; i < route.values.length; i++) {
                route.values[i].distance = this.getDistance(+route.values[i - 1].lat, +route.values[i - 1].lon,
                    +route.values[i].lat, +route.values[i].lon);
                route.total += route.values[i].distance;
            }
        }
        return nestedBuses.sort(function (a, b) {
            return b.total - a.total;
        });
    }

    getDistance = function (lat1, lon1, lat2, lon2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    render() {
        return (
            <div>
                <svg
                    width="800"
                    height="600"
                    ref={(svg) => this.svg = svg}>

                </svg>
            </div>
        );
    }
}

export default Diagram;