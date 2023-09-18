import React, {useState} from 'react';
import './ActivityCard.css';
import testPhoto from '../../assets/images/test.jpg'
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import {useNavigate} from "react-router-dom";
import {iconSelector} from '../../components/IconSelector'

function ActivityCard({activity}) {

    const [showMap, setShowMap] = useState(false);

    const navigate = useNavigate();

    return (
        <div className="card">
            <div
                className="top-section"
                onClick={() => navigate(`/activity-page/${activity.activityId}`)}
            >
                {activity.photoUrl ?
                    <img className="photo" src={activity.photoUrl} alt="Activity"/> :
                    <img className="photo" src={testPhoto} alt="Activity"/>
                }
                <div className="title-section">
                    <div className="activityCard-icon">{iconSelector(activity.activityType)}</div>
                    <h2>{activity.title}</h2>
                </div>
            </div>
            <div className="card-changeable-space">
                <div className={showMap ? "map-side" : "no-map-side"}>
                    <div className="middle-section">
                        <div className="location">
                            <h3>Location: </h3>
                            <p>{activity.address}</p>
                        </div>
                        <div className="datetime">
                            <h3>Date: </h3>
                            <p>{activity.date}, {activity.time.substring(0, 5)}</p>
                        </div>
                    </div>
                    <div className="description-section">
                        <h3>Description: </h3>
                        <p>{activity.description}</p>
                    </div>
                    <div className="map-button">
                        <button
                            onClick={() => setShowMap(!showMap)}>{showMap ? "Back to details" : "See on map"}</button>
                    </div>
                    <div className="google-maps">
                        <GoogleMapComponent height={'270px'} width={'400px'}
                                            address={`${activity.address}`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityCard;