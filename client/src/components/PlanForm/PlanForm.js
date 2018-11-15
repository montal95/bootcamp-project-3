import React, { Component } from "react";
import "./PlanForm.css";
import API from "../../api/user";

class PlanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "description": null,
      "location": null,
      "startTime": null,
      "endTime": null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(event){
    this.setState({[event.target.id]:event.target.value})
  }

  handleSubmit(event){
    let form = document.getElementById("planForm");
    let userId = this.props.id;
    let description = this.state.description;
    let location = this.state.location;
    let startTime = this.state.startTime;
    let endTime = this.state.endTime;
    let newPlan = {
        'description':`${description}`,
        'location' : `${location}`,
        'startTime' : `${startTime}`,
        'endTime' : `${endTime}`
    }

    let sendPlan = {
      'description':`${description}`,
      'location' : `${location}`,
      'startTime' : `${startTime}`,
      'endTime' : `${endTime}`
  }
    console.log(`User id: ${userId}`)
    console.log(`Plan info:`);
    console.log("================");
    console.log(newPlan);
    console.log("Making API post");
    API.newPlan(userId, sendPlan);
    this.props.newPlanSubmit(newPlan);
    form.reset();
  }

  render() {
    return (
      <div className="container" id="formCard">
        <div className="card bd-dark text-white mb-2" >
          <div
            className="card-header bg-dark text-white"
            data-toggle="collapse"
            data-target="#collapseForm"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <h2 className="float-left">Make Plans</h2>
            <span className="float-right">
              <i className="fas fa-plus" />
            </span>
          </div>
          <div className="card collapse card-body" id="collapseForm">
            <form id="planForm">
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="Description"
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="Location"
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-group mb-2">
                <input
                  type="datetime-local"
                  className="form-control"
                  id="startTime"
                  placeholder=""
                  onChange={this.handleChange}
                />
                <input
                  type="datetime-local"
                  className="form-control"
                  id="endTime"
                  placeholder="End Time"
                  onChange={this.handleChange}
                />
              </div>
              <button className="btn btn-outline-primary noteSubmit" type="button" onClick={this.handleSubmit} data-id={this.props.id} id={this.props.id}>Submit</button>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PlanForm;
