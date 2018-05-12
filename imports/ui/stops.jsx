import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";

// Comments component
class Schedule extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        this.renderSchedule();
    }


    renderSchedule() {
        return (
            <ul className="list-group">

            </ul>
        )
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default Schedule;