import React, {Component} from "react";
import AccountsUIWrapper from './AccountsUIWrapper.js';

class Nav extends Component {

    render() {
        return (
                <div>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                            <div className="container">
                                <a className="navbar-brand" href="/">NextBus Visualization</a>
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"/>
                                </button>

                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav ml-auto">

                                        <li className="nav-item center-login"><AccountsUIWrapper/></li>

                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>

                </div>

        );
    }
}

export default Nav;