import React, {Component} from "react";
import * as d3 from "d3";
import * as d3Chromatic from "d3-scale-chromatic";

class Map extends Component {
    constructor(props) {
        super(props);

        this.svg;
        this.margin = {top: 40, left: 40, right: 40, bottom: 40};
        this.state = {};
    }

    componentDidMount() {
        const svg = d3.select(this.svg);
        this.width = +svg.attr("width") - this.margin.left - this.margin.right,
            this.height = +svg.attr("height") - this.margin.top - this.margin.bottom,
            this.g = svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        d3.json("sf.json", function(err, data) {
            console.log(err);
            console.log(data);
        });

        d3.queue()
            .defer(d3.json, "hola.json")
            .await(ready)

        function ready (err, data) {
            console.log(data);
            console.log(err);
        }
    }

    componentDidUpdate() {
        this.update(this.props.data);
    }

    update(data) {

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

export default Map;