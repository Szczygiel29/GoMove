import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import './Profile.css';
import {Context} from "../../App";
import testPhoto from "../../assets/images/test.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {iconSelector} from '../IconSelector'

function Profile() {
    const userData = useContext(Context).userData;
    const [carouselIndex, setCarouselIndex] = useState({owned: 0, takePart: 0});
    const [ownedActivities, setOwnedActivities] = useState([]);
    const [allUserActivities, setAllUserActivities] = useState([]);
    const navigate = useNavigate();

    function displayActivities(activities, type) {

        if (activities.length > 0) {
            return (
                <div className='activities-carousel-inner-container'>
                    <div className='activities-in-profile-swipe-left-container'
                         onClick={() => handleIndexChange(-1, type)}>
                        <button className="activities-in-profile-swipe-left-button">
                            <FontAwesomeIcon icon={faChevronLeft}/></button>
                    </div>
                    <div className="activities-in-profile-carousel">
                        <div className="activities-container">
                            {activities.map((activity) => (
                                <div
                                    className="activity-card"
                                    key={activity.activityId}
                                    onClick={() => navigate(`/activity-page/${activity.activityId}`)}
                                >
                                    <div className="activity-title">{activity.title}</div>
                                    <div className="activity-type">{iconSelector(activity.activityType)}</div>
                                        <div className="activity-date-time">
                                            <span className="activity-date">{activity.date + " "}</span>
                                            <span className="activity-time">{" " + activity.time.substring(0, 5)}</span>
                                        </div>
                                    <div className="activity-details">
                                        <div className="activity-city">{activity.city}</div>
                                    </div>
                                    <img src={testPhoto} alt={activity.title} className="activity-image"/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='activities-in-profile-swipe-right-container'>
                        <button className="activities-in-profile-swipe-right-button"
                                style={{visibility: activities.length <= 5 ? 'hidden' : 'visible'}}
                                onClick={() => handleIndexChange(1, type)}>
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </button>
                    </div>
                </div>
            )
        } else {
            return <h3>User has no activities</h3>;
        }
    }

    const handleIndexChange = (amount, type) => {
        const newIndex = carouselIndex[type] + amount;
        if (newIndex >= 0 && newIndex <= allUserActivities.length - 5) {
            setCarouselIndex({...carouselIndex, [type]: newIndex});
        }
    }
    const manageCarouselChange = (index, activities, order) => {
        const displayedActivities = document.querySelectorAll('.activities-container')[order];
        if (displayedActivities) {
            const swipeLeftButton = document.querySelectorAll('.activities-in-profile-swipe-left-container')[order]
            const swipeRightButton = document.querySelectorAll('.activities-in-profile-swipe-right-container')[order]
            if (index <= 0) {
                hideButton(swipeLeftButton)
            } else {
                displayButton(swipeLeftButton)
            }
            if (index > activities.length - 6) {
                hideButton(swipeRightButton)
            } else {
                displayButton(swipeRightButton)
            }
            displayedActivities.style.right = `${index * 230 + 'px'}`
        }
    }
    const displayButton = (button) => {
        button.style.opacity = 1;
        button.style.visibility = 'visible';
    }
    const hideButton = (button) => {
        button.style.opacity = 0;
        setTimeout(() => {
            button.style.visibility = 'hidden';
        }, 500)
    }
    useEffect(() => {
        manageCarouselChange(carouselIndex.takePart, allUserActivities, 0)
    }, [carouselIndex.takePart])


    useEffect(() => {
        manageCarouselChange(carouselIndex.owned, ownedActivities, 1)
    }, [carouselIndex.owned])

    async function fetchOwnedActivities(userId) {
        const response = await fetch(
            `http://localhost:8080/activities/user/${userId}`, {
                headers: {Authorization: localStorage.getItem("jwt")}
            })
        const ownedActivities = await response.json();
        const sortedOwnedActivities = ownedActivities.sort(chronologicalSort);
        setOwnedActivities(sortedOwnedActivities);
    }

    async function fetchAllUserActivities(userId) {
        const response = await fetch(
            `http://localhost:8080/activities/participant/${userId}`, {
                headers: {Authorization: localStorage.getItem("jwt")}
            })
        const userActivities = await response.json();
        const sortedUserActivities = userActivities.sort(chronologicalSort);
        setAllUserActivities(sortedUserActivities);
    }

    function chronologicalSort(a, b) {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return aDateTime - bDateTime;
    }

    useEffect(() => {
        if (Object.keys(userData).length !== 0) {
            fetchOwnedActivities(userData.userId);
            fetchAllUserActivities(userData.userId);
        }
    }, [userData]);


    return (
        <div>
            <div className="user-inner-container">
                <div className="user-card">
                    <p className="username">{userData.username}</p>
                    <div className="profile-picture-container">
                        <img
                            className="profile-picture"
                            src={userData.userPhoto ? 'data:image/jpeg;base64,' + userData.userPhoto : null}
                            alt="Profile picture"
                        />
                    </div>
                </div>
                <div className="user-details">
                    <h3 className="activity-label">Preferred Activity:</h3>
                    <p className="activity-info">{userData.preferredActivity}</p>

                    <h3 className="activity-label">City:</h3>
                    <p className="activity-info">{userData.city}</p>

                    <h3 className="activity-label">Description:</h3>
                    <p className="activity-info">{userData.description}</p>
                    <button className="update-info-button" onClick={() => navigate("/update-info")}>Update info</button>
                </div>
            </div>
            <h3 className="activity-type-title">Taking part</h3>
            <div className="activity-carousel-outer-container">
                {displayActivities(allUserActivities, 'takePart')}
            </div>
            <h3 className="activity-type-title">Owned</h3>
            <div className="activity-carousel-outer-container">
                {displayActivities(ownedActivities, 'owned')}
            </div>
        </div>
    )
}

export default Profile;