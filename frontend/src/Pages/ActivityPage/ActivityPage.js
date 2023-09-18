import './ActivityPage.css';
import {useContext, useEffect, useState} from "react";
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import ActivityComments from "../../components/ActivityComments/ActivityComments";
import {
    faCalendarDays, faCopy,
    faLocationPin,
    faTrash,
    faUser,
    faUserMinus,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "react-router-dom";
import {Context} from "../../App";
import {iconSelector} from '../../components/IconSelector'

function ActivityPage() {
    const userData = useContext(Context).userData;
    const setDisplayLoginForm = useContext(Context).setDisplayLoginForm;
    const setDisplayActivityDeleteModal = useContext(Context).setDisplayActivityDeleteModal;
    const isUserLogged = useContext(Context).isUserLogged;

    const [activityData, setActivityData] = useState("");
    const [isUserEnrolled, setIsUserEnrolled] = useState(true);
    const [enrolledUsers, setEnrolledUsers] = useState([]);

    const {activityId} = useParams();

    useEffect(() => {
        fetchActivityData()
    }, [])

    useEffect(() => {
        if (Object.keys(activityData).length !== 0) {
            checkIsUserEnrolled();
        }
    }, [activityData])

    const handleEnrollButton = () => {
        fetch(`http://localhost:8080/users/enroll/${localStorage.getItem("userId")}/${activityId}`, {
            method: 'PATCH',
            headers: {
                "Authorization": localStorage.getItem("jwt"),
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("User enrolled successfully");
                    setIsUserEnrolled(true);
                    let newEnrolledUsers = [...enrolledUsers];
                    newEnrolledUsers.push(userData.username);
                    setEnrolledUsers(newEnrolledUsers);
                } else {
                    console.log("something went wrong")
                }
            })
    }

    const handleUnsubscribeButton = async () => {
        fetch(`http://localhost:8080/activities/unsubscribe-user/${localStorage.getItem("userId")}/${activityId}`, {
            headers: {Authorization: localStorage.getItem("jwt"), "Content-Type": "application/json"},
            method: "PATCH",
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("User unsubscribed successfully");
                    setIsUserEnrolled(false);
                    let newEnrolledUsers = [...enrolledUsers];
                    let indexOfUser = newEnrolledUsers.indexOf(userData.username);
                    newEnrolledUsers.splice(indexOfUser, 1)
                    setEnrolledUsers(newEnrolledUsers);
                } else {
                    console.log("something went wrong")
                }
            })
    }

    const fetchActivityData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/activities/${activityId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setActivityData(data);
            setEnrolledUsers(data.participants.map(participant => participant.username));
        } catch (error) {
            console.error('Error fetching activity data:', error);
        }
    };

    const checkIsUserEnrolled = () => {
        setIsUserEnrolled(activityData.participants.filter(participant =>
            participant.userId === localStorage.getItem("userId")
        ).length > 0)
    }
    const handleCopyClick = () => {
        const invitationLink = "http://localhost:3000/activity-page/" + activityData.activityId;
        const textToCopy = 'Hi! Join my activity ' + activityData.title + ' at ' + activityData.date + ' in ' +
            activityData.address + ' using link below: \n' + invitationLink;
//TODO zrobić link, którego kliknięcie powoduje dołączenie do aktywności
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copiedAlert = document.querySelector('.copied-message-alert');
            copiedAlert.style.bottom = '0px'
            setTimeout(() => {
                copiedAlert.style.bottom = '20px'
            }, 3000)
        }).catch((error) => {
            console.error('Błąd kopiowania do schowka: ', error);
        });
    };

    return (
        <div className={"activity-page"}>
            {activityData ? (
                <div>
                    <div className="activity-icon">{iconSelector(activityData.activityType)}</div>
                    <h1>{activityData.title}</h1>
                    <hr/>
                    <br/>
                    {activityData.activityPhotoUrl ?
                        <img src={activityData.activityPhotoUrl} alt={activityData.title} className="activity-image"/>
                        : null}

                    <h3>Description:</h3>
                    <p>{activityData.description}</p>
                    <br/>
                    <br/>
                    <div className="activity-page-middle-section">
                        <div className="place-date">
                            <h3>Place of meeting:</h3>
                            <div className="place">
                                <FontAwesomeIcon icon={faLocationPin} size="2xl"/>
                                <p>{activityData.address}</p>
                            </div>
                            <div className="date">
                                <FontAwesomeIcon icon={faCalendarDays} size="2xl"/>
                                <p>{activityData.date}, {activityData.time.substring(0, 5)}</p>
                            </div>
                        </div>
                        <div className="share-activity">
                            <h3>Share Activity</h3>
                            <div className='share-activity-methods'>
                                <FontAwesomeIcon className="copy-to-clipboard" onClick={handleCopyClick} icon={faCopy}/>
                            </div>
                            <div className="copied-message-alert-container">
                                <div className="copied-message-alert">
                                    Invitation text copied to clipboard!
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="google-maps">
                        <GoogleMapComponent height={'400px'} width={'1020px'}
                                            address={`${activityData.address}`}/>
                    </div>
                    <br/>
                    <br/>
                    <div className="info-users">
                        <div className="icon">
                            {(activityData.owner.userId === userData.userId) && isUserLogged ?
                                <FontAwesomeIcon icon={faTrash}
                                                 size="2xl"
                                                 style={{color: "#90EE90FF"}}
                                                 onClick={() => setDisplayActivityDeleteModal(true)}
                                />
                                :
                                <FontAwesomeIcon
                                    icon={!isUserEnrolled || !isUserLogged ? faUserPlus : faUserMinus}
                                    size="2xl"
                                    style={{color: "#90EE90FF"}}
                                    onClick={() =>
                                        isUserLogged
                                            ? isUserEnrolled
                                                ? handleUnsubscribeButton()
                                                : handleEnrollButton()
                                            : setDisplayLoginForm(true)
                                    }
                                />

                            }
                        </div>

                    </div>
                    <hr/>
                    <br/>
                    <h3>Participants:</h3>
                    <div>
                        {enrolledUsers.length > 0 ? enrolledUsers.map(participant => (
                            <div className="users" key={participant}>
                                <FontAwesomeIcon icon={faUser} size="2xl" style={{color: "#2a2a2a",}}/>
                                <p>{participant}</p>
                            </div>
                        )) : <div className="users">
                        </div>}
                    </div>
                    <br/>
                    <hr/>
                    <h3>Leave a message:</h3>
                    <div className="activity-comments">
                        <ActivityComments currentActivityID={activityId}/>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ActivityPage;