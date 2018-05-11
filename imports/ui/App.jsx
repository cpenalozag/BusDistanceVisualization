import React, {Component} from "react";
import {withTracker} from "meteor/react-meteor-data";

import {Agencies} from "../api/agencies";
import {Comments} from "../api/comments";

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
            callApi: false,
            routes: [],
            route: ""
        };
    }

    getVehicles(agency, name) {
        this.setState({selected: true, agency: agency, name: name, route: ""});
        Meteor.call('vehicles.get', agency, (error, result) => {
            if (error) {
                // handle the error
            } else {
                this.setState({data: result});
            }
        });
        this.getRoutes(agency);

        if (!this.state.callApi) {
            this.callAPI();
        }
    }

    callAPI() {
        Meteor.setInterval(() => {
            Meteor.call('vehicles.get', this.state.agency, (error, result) => {
                if (error) {
                    // handle the error
                } else {
                    this.setState({data: result, callApi: true});
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

    renderRoutes() {
        return this.state.routes.map((route, i) => {
            return (
                <a key={i} onClick={() => this.handleComments(route.tag)} className="nostyle">
                    <li className="list-group-item">{route.title}</li>
                </a>
            )
        });
    }

    handleComments(tag) {
        this.setState({route: tag});
    }

    getRoutes(agency) {
        Meteor.call('routes.get', agency, (error, result) => {
            if (error) {
                // handle the error
            } else {
                let list = result.data.route;
                if (Array.from(list).length === 0) {
                    list = [];
                    list.push(result.data.route);
                }
                this.setState({routes: list});
            }
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
                            <div className="col-md-3">
                                <h2>Routes</h2>
                                <ul className="list-group">
                                    {this.renderRoutes()}
                                </ul>
                            </div>
                            <div className="col-md-5">
                                {this.state.route.length !== 0 ?
                                    <CommentList comments={this.props.comments} route={this.state.route}/>
                                    : ""}

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
    Meteor.subscribe("Comments");
    return {
        agencies: Agencies.find({}).fetch(),
        comments: Comments.find({}, {sort: {createdAt: -1}}).fetch()
    };
})(App);