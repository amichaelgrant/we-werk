/**
 * Work.jsx
 * @author Michael Grant <ulermod@gmail.com>
 * @date July 2017
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Axio from './Axio';
import lodash from 'lodash';

class WorkList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            jobList: []
        };

        this.loadJobs = this.loadJobs.bind(this);
        this.renderJobList = this.renderJobList.bind(this);
    }

    loadJobs(){
        Axio('GET', '/job', null, function(err, result){
            console.log(err, result);
            this.setState({ jobList: (result.items||[]) });
        }.bind(this));
    }

    componentDidMount(){
        this.loadJobs();
    }

    renderJobList(){
        var list = (this.state.jobList || []);
        return lodash.map(list, function(item, i){
            return(
                <div className="job-item" key={i}>
                    <h4><a onClick={this.viewWork}>{item.Title}</a></h4>
                    <div className="job-properties">
                        <span className="job-property"></span>
                        <span className="job-property"></span>
                        <span className="job-property"></span>
                        <span className="job-property"></span>
                    </div>
                </div>
            );
        }.bind(this));
    }
    render(){
        return(
            <div className="">
                <h3>Jobs</h3>
                <div className="job-group">{this.renderJobList()}</div>
            </div>
        );
    }

};

export default WorkList;