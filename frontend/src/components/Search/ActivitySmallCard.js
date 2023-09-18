import React, {useContext} from 'react';
import './ActivitySmallCard.css';
import testPhoto from "../../assets/images/test.jpg";
import {useNavigate} from "react-router-dom";
import {Context} from "../../App";
import {iconSelector} from '../IconSelector'

const ActivitySmallCard = ({activity, handleJoinActivity}) => {

    const isUserLogged = useContext(Context).isUserLogged;
    const setDisplayLoginForm = useContext(Context).setDisplayLoginForm;

    const navigate = useNavigate();

    return (
        <div className="searched-activity-card">
            <div className="activity-photo">{activity.photoUrl ?
                <img src={activity.photoUrl} alt="Activity"/> :
                <img src={testPhoto} alt="Activity"/>
            }</div>
            <div className="info-section">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-type">{iconSelector(activity.activityType)}</div>
                <div className="activity-city">{activity.address}</div>
                <div className="activity-date">{activity.date}, {activity.time.substring(0, 5)}</div>
                <div className="searched-card-buttons">
                    <button onClick={() => navigate(`/activity-page/${activity.activityId}`)}
                            className="details-button">Details
                    </button>
                    <button
                        className="join-button"
                        onClick={() => {
                            if (isUserLogged) {
                                handleJoinActivity(activity.activityId);
                            } else {
                                setDisplayLoginForm(true);
                            }
                        }}
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivitySmallCard;