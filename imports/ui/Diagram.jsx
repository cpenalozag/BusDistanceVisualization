import React, {Component} from "react";
import * as d3 from "d3";
import * as d3Chromatic from "d3-scale-chromatic";

class Diagram extends Component {
    constructor(props) {
        super(props);

        this.svg;
        this.margin = {top: 40, left: 40, right: 40, bottom: 5};
        this.state = {

        };
    }

    componentDidMount() {
        const svg = d3.select(this.svg);
        this.width = +svg.attr("width") - this.margin.left - this.margin.right,
            this.height = +svg.attr("height") - this.margin.top - this.margin.bottom,
            this.g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.x = d3.scaleBand()
            .rangeRound([0, this.width - this.margin.left - this.margin.right])
            .paddingInner(0.05)
            .align(0.1);

        this.y = d3.scaleLinear()
            .rangeRound([this.height - this.margin.top - this.margin.bottom, 0]);

        this.z = d3.scaleSequential(d3Chromatic.interpolateBlues);

        this.g.append("g")
            .attr("class", "axis--x")
            .attr("transform", "translate(0," + (this.height - this.margin.top - this.margin.bottom) + ")")
            .call(d3.axisBottom(this.x));

        this.g.append("g")
            .attr("class", "axis--y")
            .append("text")
            .attr("x", 2)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Added distance");

    }

    componentDidUpdate() {
        this.update(this.props.data);
    }

    update(data) {
        let nestedBuses = d3.nest().key((d) => d.routeTag).entries(data);
        if (!nestedBuses ||nestedBuses.length===0) return;
        this.computeDistances(nestedBuses);
        let maxNumBuses = d3.max(nestedBuses.map((d) => d.values.length));
        let keys = d3.range(maxNumBuses);
        let stackedBuses = d3.stack()
            .keys(keys)
            .value((d, key) => {
                return key < d.values.length ? d.values[key].distance : 0;
            })(nestedBuses)

        this.x.domain(nestedBuses.map(function (d) {
            return d.key;
        }));

        this.y.domain([0, d3.max(nestedBuses, function (d) {
            return d.total;
        })]).nice();
        this.z.domain([0, maxNumBuses]);

        this.g.selectAll("rect").remove()
            .transition().duration(1000)

        this.g.append("g")
            .selectAll("g")
            .data(stackedBuses)
            .enter()
            .append("g")
            .attr("fill", (d) => {
                return this.z(d.key);
            })
            .attr("stroke", "white")
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", (d) => {
                return this.x(d.data.key);
            })
            .attr("y", (d) => {
                return this.y(d[1]);
            })
            .attr("height", (d) => {
                return this.y(d[0]) - this.y(d[1]);
            })
            .attr("width", this.x.bandwidth());

        this.g.select(".axis--x")
            .transition().duration(1000)
            .call(d3.axisBottom(this.x));

        this.g.select(".axis--y")
            .transition().duration(1000)
            .call(d3.axisLeft(this.y).ticks(null, "s"));

        this.g.select(".legend").remove();

        var legend = this.g.append("g")
            .attr("class","legend")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(-50," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", this.width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", this.z);

        legend.append("text")
            .attr("x", this.width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });
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
                    width="1200"
                    height="600"
                    ref={(svg) => this.svg = svg}>

                </svg>
            </div>
        );
    }
}

export default Diagram;