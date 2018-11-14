import React from "react";
import "./PlanCard.css";

const PlanCard = props => {

    const progStyle = {
        width: props.progressPerc,
        backgroundColor: props.progressRoute
    }

  return (
    <div
      className="card bg-dark text-white mb-3"
      data-id={props._id}
      id={`card-${props._id}`}
      key={props.key}
    >
      <div className="card-header text-left">
        <h4>
          {props.description}
          <span className="float-right">{`${props.timeUntil} / ${
            props.displayTime
          }`}</span>
        </h4>
      </div>
      <div className="progress-container">
        <div className="progress" style={progStyle}/>
      </div>
      <div className="card-body text-left" id={props._id}>
        <ul>
          <li>
            <p className="card-text">Description: {props.description}</p>
          </li>
          <li>
            <p className="card-text">Location: {props.location}</p>
          </li>
          <li>
            <p className="card-text">Plan ends: {props.endTime}</p>
          </li>
          <li>
            <button
              className="btn btn-danger btn-block btn-sm mr-3 mb-1 mt-2"
              type="button"
              data-target={props._id}
              onClick={() => props.deleteArticle(props._id)}
            >
              Delete <i className="fas fa-plus" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
