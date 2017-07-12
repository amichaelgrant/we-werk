/**
 * WorkView.jsx
 * @author Michael Grant <ulermod@gmail.com>
 * @date July 2017
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Axio from './Axio';
import lodash from 'lodash';

class WorkView extends React.Component{
    constructor(props){
        super(props);
        this.Id = props.data.Id;
        this.state = {
            job: {}
        };

    }

    loadJobs(){
        Axio('GET', '/job/' + this.Id, null, function(err, result){
            console.log(err, result);
            this.setState({ jobList: (result.item||{}) });
        }.bind(this));
    }

    componentDidMount(){
        this.loadJobs();
    }

    
    render(){
        return(
            <div className="">
                <h3>{this.state.job.Title}</h3>
                <div className="">Work View</div>
            </div>
        );
    }

};

export default WorkView;