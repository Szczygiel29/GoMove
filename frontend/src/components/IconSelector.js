import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPersonBiking, faPersonRunning, faPersonSkating, faPersonWalking} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export function iconSelector(activityType) {
    let iconToDisplay;
    switch (activityType) {
        case "RUNNING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonRunning} size="2xl"/>
            break;
        case "CYCLING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonBiking} size="2xl"/>
            break;
        case "WALKING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonWalking} size="2xl"/>
            break;
        case "SKATING":
            iconToDisplay = <FontAwesomeIcon icon={faPersonSkating} size="2xl"/>
            break;
    }
    return iconToDisplay;
}
