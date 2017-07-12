/**
 * WorkCreate.jsx
 * @author Michael Grant <ulermod@gmail.com>
 * @date July 2017
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Axio from './Axio';
import Debug from 'debug';
var debug = Debug('Werk:WorkCreate.jsx');

class Work extends React.Component{
    constructor(props){
        super(props);
        var data = (props.data || {});
        this.state = {
            Title: data.Title,
            Description: data.Title,
            Location: data.Location,
            Remote: data.Remote,
            DeskPlus: data.DeskPlus,
            TravelLite: data.TravelLite,
            TimeShift: data.TimeShift,
            MicroAgility: data.MicroAgility,
            PartTime: data.PartTime
        };

        this.loadUserInstance = this.loadUserInstance.bind(this);
        this.save             = this.save.bind(this);
        this.titleChange      = this.titleChange.bind(this);
        this.descriptionChange= this.descriptionChange.bind(this);
        this.locationChange   = this.locationChange.bind(this);
        this.remoteChange     = this.remoteChange.bind(this);
        this.deskPlusChange   = this.deskPlusChange.bind(this);
        this.travelLiteChange = this.travelLiteChange.bind(this);
        this.timeShiftChange  = this.timeShiftChange.bind(this);
        this.microAgilityChange = this.microAgilityChange.bind(this);
        this.partTimeChange   = this.partTimeChange.bind(this);
    }

    loadUserInstance(){
        Axio('GET', '/account/session', null, function(err, result){
            console.log(err, result);
            this.setState({ userInstance: result });
        }.bind(this));
    }
    save(e){
        $(this.refs.createModal).modal('hide');
        var data = this.state;
        Axio('POST', '/job', data, function(err, result){
            debug('save# ', err, result);
        }.bind(this));
    }
    
    titleChange(e){
        this.setState({Title: e.target.value });
    }
    descriptionChange(e){
        this.setState({Description: e.target.value });
    }
    locationChange(e){
        this.setState({Location: e.target.value });
    }
    remoteChange(e){
        this.setState({Remote: e.target.value });
    }
    deskPlusChange(e){
        this.setState({DeskPlus: e.target.value });
    }
    travelLiteChange(e){
        this.setState({TravelLite: e.target.value });
    }
    timeShiftChange(e){
        this.setState({TimeShift: e.target.value });
    }
    microAgilityChange(e){
        this.setState({MicroAgility: e.target.value });
    }
    partTimeChange(e){
        this.setState({PartTime: e.target.value });
    }

    componentDidMount(){
        $(this.refs.createModal).on('hidden.bs.modal', function(e){
            debug('');
        });
        $(this.refs.createModal).modal('show');
    }
    componentWillUnmount(){
        $(this.refs.createModal).modal('hide');
    }
    render(){
        return(
            <div className="">
                
                <div ref="createModal" className="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false" >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="myModalLabel">Create Job</h4>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div className="form-group">
                                        <label for="Title">Title</label>
                                        <input type="text" className="form-control" name="Title" placeholder="Tile" onChange={this.titleChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <label for="Description">Description</label>
                                        <textarea className="form-control" name="Description" placeholder="Description" onChange={this.descriptionChange} required></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label for="Location">Location</label>
                                        <input className="form-control" name="Location" placeholder="Location" onChange={this.locationChange} required/>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="Remote" onChange={this.remoteChange}/> Remote
                                        </label>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="DeskPlus" onChange={this.deskPlusChange}/> DeskPlus
                                        </label>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="TravelLite" onChange={this.travelLiteChange}/> TravelLite
                                        </label>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="TimeShift" onChange={this.timeShiftChange}/> TimeShift
                                        </label>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="TravelLite" onChange={this.microAgilityChange}/> MicroAgility
                                        </label>
                                    </div>
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" name="Type" value="TravelLite" onChange={this.partTimeChange}/> PartTime
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

};

export default Work;