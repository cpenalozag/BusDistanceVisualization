import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";

import {Agencies} from "../api/agencies";
import Diagram from "./Diagram";
import CommentList from "./CommentList";
import Nav from "./Nav";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            selected: false,
            agency: "",
            name: "",
            callApi:false
        };
    }

    getVehicles(agency, name) {
        this.setState({selected: true, agency: agency, name: name});
        Meteor.call('vehicles.get', agency, (error, result) => {
            if (error) {
                // handle the error
            } else {
                this.setState({data: result});
            }
        });
        if (!this.state.callApi){
            this.callAPI();
        }
    }

    callAPI (){
        Meteor.setInterval(()=>{
            Meteor.call('vehicles.get', this.state.agency, (error, result) => {
                if (error) {
                    // handle the error
                } else {
                    this.setState({data: result, callApi:true});
                }
            });
        }, 10000)

    }

    renderAgencies() {
        return this.props.agencies.map((agency, i) => {
            return (
                <a key={i} onClick={() => this.getVehicles(agency.tag, agency.title)} className="nostyle">
                    <li className="list-group-item">{agency.title}</li>
                </a>
            )
        });
    }

    render() {
        return (
            <div>
                <Nav/>
                <div>
                    <div className="container-fluid text-center">
                        <div className="row"><h1>Distance Between Buses Visualization</h1></div>
                        <div className="row">
                            <div className="col-md-12">
                                {!this.state.selected ? <h4>Select an agency to start visualizing</h4> :
                                    <h4>{this.state.name}</h4>}
                                <Diagram data={this.state.data}/>
                            </div>
                        </div>
                    </div>
                    <div className="container text-center">
                        <div className="row">
                            <div className="col-md-4">
                                <h2>Agencies</h2>
                                <ul className="list-group">
                                    {this.renderAgencies()}
                                </ul>
                            </div>
                            <div className="col-md-8">
                                <CommentList comments={[]}/>
                            </div>
                        </div>
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