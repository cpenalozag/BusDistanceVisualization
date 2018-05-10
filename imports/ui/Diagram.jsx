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
            margin = {top: 40, left: 40, right: 40, bottom: 40};
    }

    componentDidUpdate() {
        let nestedBuses = d3.nest().key((d) => d.routeTag).entries(this.props.data);
        this.computeDistances(nestedBuses);
        let maxNumBuses = d3.max(nestedBuses.map((d) => d.values.length));
        let keys = d3.range(maxNumBuses);
        let stackedBuses = d3.stack()
            .keys(keys)
            .value((d, key) => {
                return key < d.values.length ? d.values[key].distance : 0;
            })(nestedBuses)
        console.log(stackedBuses);
        console.log(typeof stackedBuses);
    }

    update(data){
        var svg = d3.select(this.svg),
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        x.domain(data.map(function(d) { return d.State; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
        z.domain(keys);

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.data.State); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Population");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });
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