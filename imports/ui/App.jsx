import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";

import {Agencies} from "../api/agencies";
import Diagram from "./Diagram";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:"",
        };
    }

    getVehicles(agency)
    {
        Meteor.call('vehicles.get', agency, (error, result) => {
            if (error) {
                // handle the error
            } else {
                this.setState({data:result});
            }
        });
    }

    renderAgencies ()
    {
        return this.props.agencies.map((agency, i) => {
            return (
                <a key={i} onClick={()=>this.getVehicles(agency.tag)} className="nostyle"><li className="list-group-item">{agency.title}</li></a>
            )
        });
    }
    render() {
        return (
                <div className="container text-center">
                    <div className="row"><h1>Final Exam</h1></div>
                    <div className="row">
                        <div className="col-md-4">
                            <h2>Agencies</h2>
                            <ul className="list-group">
                                {this.renderAgencies()}
                            </ul>
                        </div>
                        <div className="col-md-8">
                            <h2>Distance</h2>
                            <Diagram data={this.state.data}/>
                        </div>
                    </div>
                </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("Agencies");
    return {
        agencies: Agencies.find({}).fetch()
    };
})(App);