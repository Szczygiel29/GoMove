import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import './AdditionalUserInfoForm.css'
import Modal from "react-modal";
import additionalProfileInfoModalStyles from "../../ModalStyles";
import {useRef} from 'react';
import {Context} from "../../App";

function AdditionalUserInfoForm() {
    const userData = useContext(Context).userData;
    const [city, setCity] = useState("");
    const [preferredActivity, setPreferredActivity] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState("");
    const uploadImageRef = useRef(null);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        setSelectedImage(base64);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        userData.description = description;
        userData.city = city;
        userData.preferredActivity = preferredActivity;
        if (selectedImage) {
            userData.userPhoto = selectedImage.split(",")[1];
        }

        fetch(`http://localhost:8080/users/update/${localStorage.getItem("userId")}`, {
            headers: {Authorization: localStorage.getItem("jwt"), "Content-Type": "application/json"},
            method: "PATCH",
            body: JSON.stringify({
                "city": city,
                "preferredActivity": preferredActivity,
                "description": description,
                "userPhoto": selectedImage.split(",")[1]
            })
        }).then(response => {
            if (response.status === 200) {
                console.log("Update info successful");
                navigate("/profile")
            } else {
                console.log("something went wrong")
            }
        })
    }

    return (
        <div className="additional-info">
            <Modal
                isOpen={true}
                style={additionalProfileInfoModalStyles}
                className="additional-info-modal"
            >
                <h4 className="additional-info-title">Please fill this form, so we can provide you more
                    personalized activities</h4>
                <form className="additional-info-form" onSubmit={handleSubmit}>
                    <div className="form-container">
                        <div>
                            <div>
                                <button className="custom-file-button" type="button" onClick={() => uploadImageRef.current.click()}>
                                    <img className='profile-picture'
                                         src={selectedImage ? selectedImage : 'blank-profile-picture.png'}></img>
                                    <div className='change-photo-button'>
                                        Click to change
                                    </div>
                                </button>
                                <input
                                    ref={uploadImageRef}

                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleImageUpload}
                                    style={{display: 'none'}}
                                />
                            </div>
                        </div>
                        <div className="additional-info-form-right-side">
                            <div className="city-field">
                                <label className="city-label">City</label>
                                <textarea
                                    className="city-input"
                                    type="text"
                                    id="city"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="profile-description-field">
                                <label className="profile-description-label">Description</label>
                                <textarea className="profile-description-input"
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}>
                                </textarea>
                            </div>
                            <div className="preferred-activity-field">
                                <label className="preferred-activity-label">Preferred activity</label>
                                <select
                                    className="preferred-activity-select"
                                    id="preferred-activity"
                                    defaultValue="Select"
                                    style={{color: preferredActivity ? 'black' : 'grey'}}
                                    onChange={e => setPreferredActivity(e.target.value)}
                                >
                                    <option hidden value="Select">Select</option>
                                    <option style={{color: 'black'}} value="SKATING">Skating</option>
                                    <option style={{color: 'black'}} value="CYCLING">Cycling</option>
                                    <option style={{color: 'black'}} value="WALKING">Walking</option>
                                    <option style={{color: 'black'}} value="RUNNING">Running</option>
                                </select>
                            </div>
                            <div className='additional-info-submit-btn-container'>
                                <button className="additional-info-submit-btn" type="submit">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
        ;
}

export default AdditionalUserInfoForm;