import React from 'react';
import ReactDOM from 'react-dom';
import Axio from './Axio';

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {};

        this.loadUserInstance = this.loadUserInstance.bind(this);
    }

    loadUserInstance(){
        Axio('GET', '/account/session', null, function(err, result){
            console.log(err, result);
            this.setState({ userInstance: result });
        }.bind(this));
    }

    componentDidMount(){
        this.loadUserInstance();
    }
    render(){
        var userString = (this.state.userInstance && this.state.userInstance.Email)? this.state.userInstance.Email : '';
        return(
            <div className="">
                
                <nav className="navbar navbar-default">
                    <div className="container">
                        <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Werk</a>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            
                            <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Menu <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                <li><a href="#">Item 1</a></li>
                                <li><a href="#">Item 2</a></li>
                                <li><a href="#">Item 3</a></li>
                                <li role="separator" className="divider"></li>
                                <li><a href="#">Item 4</a></li>
                                <li role="separator" className="divider"></li>
                                <li><a href="#">Item 5</a></li>
                            </ul>
                            </li>
                        </ul>
                        <form className="navbar-form navbar-left">
                            <div className="form-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </form>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#">Messages</a></li>
                            <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{userString} <span className="caret"></span></a>
                            <ul className="dropdown-menu">
                                <li><a href="#">Profile</a></li>
                                <li><a href="#">Preferences</a></li>
                                <li role="separator" className="divider"></li>
                                <li><a href="/logout">Log out</a></li>
                            </ul>
                            </li>
                        </ul>
                        </div>
                    </div>
                </nav>

                <div className="container margin-top-100">
                    <div className="row margin-top-100">
                        <div className="col-sm-12 col-md-12">
                            <div ref="mntPoint"></div>
                            <h1>And all the sweetness goes [here]</h1>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};


var rootView = document.createElement('div');
rootView.setAttribute('id', 'rootView');
document.body.appendChild(rootView);
ReactDOM.render(<Account />, rootView);