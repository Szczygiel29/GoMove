import {useContext} from "react";
import {Context} from "../../App";
import './ActivityDeleteModal.css'
import {useNavigate, useParams} from "react-router-dom";
import {faCircleCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function ActivityDeleteModal() {

    const setDisplayActivityDeleteModal = useContext(Context).setDisplayActivityDeleteModal;
    const {activityId} = useParams();
    const navigate = useNavigate();

    function handleDelete() {
        fetch(`http://localhost:8080/activities/delete/${activityId}`, {
            headers: {
                Authorization: localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            method: "DELETE"
        }).then(response => {
            if (response.status === 200) {
                setDisplayActivityDeleteModal(false);
                navigate(`/profile`)
                console.log("Activity successfully deleted")
            } else {
                console.log("Something went wrong")
            }
        })

    }

    return (
        <>
            <div className="delete-message">Are you sure you want to delete this activity?</div>
            <div className="delete-buttons">
                <div className="delete-icon">
                    <FontAwesomeIcon
                        icon={faCircleCheck}
                        size="2xl"
                        style={{color: "red"}}
                        onClick={() => handleDelete()}
                    />
                </div>
                <div className="delete-icon">
                    <FontAwesomeIcon
                        icon={faCircleXmark}
                        size="2xl"
                        style={{color: "#90EE90FF"}}
                        onClick={() => setDisplayActivityDeleteModal(false)}
                    />
                </div>

            </div>
        </>
    )

}

export default ActivityDeleteModal;