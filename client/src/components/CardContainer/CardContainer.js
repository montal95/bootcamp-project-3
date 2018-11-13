import React from "react";
import "./CardContainer.css";

const CardContainer = ({children}) => {
    return(
        <div className="container" id="cardContainer">
            <ul className="list-group">
                {children}
            </ul>
        </div>
    )
}

export default CardContainer;