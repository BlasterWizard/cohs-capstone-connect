import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Modal } from "react-bootstrap";
import { ProfileAttributeType, ProfileUser, User } from "../Interfaces+Classes";
import { UserCredential } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import { SelectOption } from "../Interfaces+Classes";
import Select from "react-select";
import toast from "react-hot-toast";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import ProfilePicture, { ProfilePictureSize } from "../components/ProfilePicture";
import Spinner from 'react-bootstrap/Spinner';

interface ProfileEditModalProps {
	handleEditModal: () => void;
	showEditModal: boolean;
	currentUser: User | undefined;
	user: UserCredential["user"] | undefined;
	visibleAttributes: ProfileAttributeType[];
}

interface FormControlProps {
	value: string;
	onChangeHandler: (e: any) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ showEditModal, handleEditModal, currentUser, user, visibleAttributes }) => {
	const [imgUrl, setImgUrl] = useState<string>("");
	const [PEMFirstName, setPEMFirstName] = useState("");
	const [PEMLastName, setPEMLastName] = useState("");
	const [PEMEmail, setPEMEmail] = useState("");
	const [PEMPhoneNumber, setPEMPhoneNumber] = useState("");
	const [PEMSchool, setPEMSchool] = useState("");
	const [gradeSelectedOption, setGradeSelectionOption] = useState<SelectOption>();
	const gradesOptions = [
		{value: "Freshmen", label: "Freshmen"},
		{value: "Sophomore", label: "Sophomore"},
		{value: "Junior", label: "Junior"},
		{value: "Senior", label: "Senior"}
	];
	const [PEMMajor, setPEMMajor] = useState("");
	const APTestScoreOptions = [
		{value: 5, label: "5"},
		{value: 4, label: "4"},
		{value: 3, label: "3"},
		{value: 2, label: "2"},
		{value: 1, label: "1"},
		{value: 0, label: "None"}
	];
	const [APResearchScore, setAPResearchScore] = useState<SelectOption>(APTestScoreOptions[5]);
	const [APSeminarScore, setAPSeminarScore] = useState<SelectOption>(APTestScoreOptions[5]);
	const [profilePicUploadFinished, setProfilePicUploadFinished] = useState<boolean>(true);
	const [PEMAPSeminarPaperTitle, setPEMAPSeminarPaperTitle] = useState<string>("");
	const [PEMAPSeminarPaperURL, setPEMAPSeminarPaperURL] = useState<string>("");
	const [PEMAPResearchPaperTitle, setPEMAPResearchPaperTitle] = useState<string>("");
	const [PEMAPResearchPaperURL, setPEMAPResearchPaperURL] = useState<string>("");

	const [PEMLinkedIn, setPEMLinkedIn] = useState<string>("");
	const [PEMInstagram, setPEMInstagram] = useState<string>("");
	const [PEMTwitter, setPEMTwitter] = useState<string>("");

	const PEMFirstNameHandler = (e: any) => { setPEMFirstName(e.target.value); }
	const PEMLastNameHandler = (e: any) => { setPEMLastName(e.target.value); }
	const PEMEmailHandler = (e: any) => { setPEMEmail(e.target.value); }
	const PEMPhoneNumberHandler = (e: any) => { setPEMPhoneNumber(e.target.value); }
	const PEMSchoolHandler = (e: any) => { setPEMSchool(e.target.value); }
	const PEMSchoolMajorHandler = (e: any) => { setPEMMajor(e.target.value); } 

	const selectGradeSelectOptionHandler = (selectedOption: any) => { setGradeSelectionOption(selectedOption); }
	const selectAPSeminarScoreSelectOptionHandler = (selectedOption: any) => { setAPSeminarScore(selectedOption); }
	const selectAPResearchScoreSelectOptionHandler = (selectedOption: any) => { setAPResearchScore(selectedOption); }
	const PEMAPSeminarPaperTitleHandler = (e: any) => { setPEMAPSeminarPaperTitle(e.target.value) };
	const PEMAPSeminarPaperURLHandler = (e: any) => { setPEMAPSeminarPaperURL(e.target.value) };
	const PEMAPResearchPaperTitleHandler = (e: any) => { setPEMAPResearchPaperTitle(e.target.value) };
	const PEMAPResearchPaperURLHandler = (e: any) => { setPEMAPResearchPaperURL(e.target.value) }; 

	const PEMLinkedInHandler = (e: any) => { setPEMLinkedIn(e.target.value )};
	const PEMInstagramHandler = (e: any) => { setPEMInstagram(e.target.value )};
	const PEMTwitterHandler = (e: any) => { setPEMTwitter(e.target.value )};

	const [newProfileAttributes, setNewProfileAttributes] = useState<ProfileAttributeType[]>([]);
	
	useEffect(() => {
		setImgUrl(currentUser?.profile?.profilePictureURL ?? "");
		setPEMFirstName(currentUser?.firstName ?? "");
		setPEMLastName(currentUser?.lastName ?? "");
		setPEMEmail(user?.email ?? "");
		setPEMPhoneNumber(currentUser?.profile?.phoneNumber ?? "");
		setPEMSchool(currentUser?.profile?.school ?? "");
		setGradeSelectionOption(gradesOptions[0]);
		setPEMMajor(currentUser?.profile?.major ?? "");
		setAPSeminarScore(APTestScoreOptions[Math.abs((currentUser?.profile?.apInfo?.APSeminarScore ?? 0) - 5)]);
		setAPResearchScore(APTestScoreOptions[Math.abs((currentUser?.profile?.apInfo?.APResearchScore ?? 0) - 5)]);
		setPEMAPResearchPaperTitle(currentUser?.profile?.apInfo?.APResearchPaperTitle ?? "");
		setPEMAPResearchPaperURL(currentUser?.profile?.apInfo?.APResearchPaperURL ?? "");
		setPEMLinkedIn(currentUser?.profile?.socialMedia.LinkedIn ?? "");
		setPEMInstagram(currentUser?.profile?.socialMedia.Instagram ?? "");
		setPEMTwitter(currentUser?.profile?.socialMedia.Twitter ?? "");
	}, [user, currentUser]);

	useEffect(() => {
		setNewProfileAttributes(visibleAttributes);
	}, [visibleAttributes]);

	async function saveProfileEditChanges() {
		if (currentUser?.studentDocID != undefined) {
			const currentUserRef = doc(db, "users", currentUser?.studentDocID);
			await updateDoc(currentUserRef, {
				firstName: PEMFirstName,
				lastName: PEMLastName,
				"profile.school": PEMSchool,
				"profile.grade": gradeSelectedOption?.value,
				"profile.major": PEMMajor,
				"profile.phoneNumber": PEMPhoneNumber,
				"profile.apInfo.APResearchScore": APResearchScore.value,
				"profile.apInfo.APSeminarScore": APSeminarScore.value,
				"profile.apInfo.APResearchPaperTitle": PEMAPResearchPaperTitle,
				"profile.apInfo.APResearchPaperURL": PEMAPResearchPaperURL,
				"profile.profilePictureURL": imgUrl,
				"profile.visibleAttributes": newProfileAttributes.map((npa) => ProfileAttributeType[npa])
			}).then(() => {
				toast.success("Profile Changes Saved!");
			}).catch((error) => {
				toast.error(error.description);
			});
			handleEditModal();
		}
	}

	const uploadProfileImageToFirestore = (e: any) => {
		e.preventDefault();
		const file = e.target[0]?.files[0];
		if (!file) {
			toast.error("Can't find File");
			return;
		}
		const storage = getStorage();
		let refName = `profileImages/${currentUser?.studentUID}.jpg`;
		const profileImagesRef = ref(storage, refName);
		const uploadTask = uploadBytesResumable(profileImagesRef, file);

		//delete any existing profile image from the same user
		deleteObject(profileImagesRef).then(() => {
			console.log("File Deleted Successfully");
		});
		uploadTask.on("state_changed", (snapshot) => {
			setProfilePicUploadFinished(false);
		}, (error) => {
			toast.error(error.message);
		},
		() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImgUrl(downloadURL);
					toast.success("Profile Picture Upload Success!");
					setProfilePicUploadFinished(true);
				});
			}
		);
	}

	const pushToNewProfileAttributes = (type: ProfileAttributeType) => {
		newProfileAttributes.includes(type) ? 
		setNewProfileAttributes(newProfileAttributes.filter((pa) => pa !== type)) :
		setNewProfileAttributes(newProfileAttributes =>[...newProfileAttributes, type]);
	}

	return (
		<Modal show={showEditModal} onHide={handleEditModal} size={"lg"} centered scrollable>
		    <Modal.Header closeButton>
		          <Modal.Title>Edit Profile</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
				<ProfilePicture user={new ProfileUser(currentUser?.firstName ?? "", currentUser?.lastName ?? "", currentUser?.profile?.profilePictureURL ?? "")} size={ProfilePictureSize.Large} />
				{/* Profile Picture Upload Progress Bar  */}
				{
					!profilePicUploadFinished &&
					<div className="flex justify-center">
						<Spinner animation="border" />
					</div>
					
				}
				{/* Profile Image Upload */}
				<form className='form flex' onSubmit={uploadProfileImageToFirestore}>
					<input type='file' accept=".jpg, .jpeg, .png"/>
					<div className="flex-grow"></div>
					<button type='submit' className="bg-sky-400 hover:bg-sky-500 px-2 py-1 rounded-lg text-white">Upload</button>
				</form>

				<hr/>

	        	 <Form>	
	        	 	<h3 className="text-xl mb-3 text-center">Personal Info</h3>
	        	 	{/*First Name*/}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="firstName">
						<Form.Label className="font-bold">First Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMFirstName} onChange={PEMFirstNameHandler} type="text" className="w-1/2"/>
					</Form.Group>
					{/*Last Name*/}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="lastName">
						<Form.Label className="font-bold">Last Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMLastName} onChange={PEMLastNameHandler} type="text" className="w-1/2"/>
					</Form.Group>
					{/*Email*/}
					<div className="mb-3 flex whitespace-nowrap items-center w-full">
						<Form.Label className="font-bold">Email: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMEmail} onChange={PEMEmailHandler} type="email" className="mr-3 w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.Email)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.Email) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</div>
					{/*Phone Number*/}
					<Form.Group className="mb-3 flex flex-col whitespace-nowrap w-full" controlId="phoneNumber">
						<div className="flex whitespace-nowrap items-center">
							<Form.Label className="font-bold">Phone Number: </Form.Label>
							<div className="flex-grow"></div>
							<Form.Control value={PEMPhoneNumber} onChange={PEMPhoneNumberHandler} type="text" className="mr-3 w-1/2" aria-describedby="phoneNumberHelpBlock"/>
							{
								<button onClick={(e) => {
									e.preventDefault();
									pushToNewProfileAttributes(ProfileAttributeType.PhoneNumber)
								}}>
									{
										newProfileAttributes.includes(ProfileAttributeType.PhoneNumber) ?
										<i className="fa-solid fa-eye"></i>  :
										<i className="fa-solid fa-eye-slash text-red-600"></i>
									}
								</button>
                        	}
						</div>
						<Form.Text id="phoneNumberHelpBlock" muted>
							<i className="fa-solid fa-triangle-exclamation mr-2 text-red-500"></i> Your phone number must be in this format: (XXX) XXX-XXXX
						</Form.Text>
					</Form.Group>
					
					<hr/>
					<h3 className="text-xl mb-3 text-center">School</h3>
					{/* School */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center w-full" controlId="School">
						<Form.Label className="font-bold">School Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMSchool} onChange={PEMSchoolHandler} type="text" className="mr-3 w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.College)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.College) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
					{/* College Grade  */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="collegeGrade">
						<Form.Label className="font-bold">Current Grade: </Form.Label>
						<div className="flex-grow"></div>
						<Select
						defaultValue={gradeSelectedOption}
						onChange={selectGradeSelectOptionHandler}
						options={gradesOptions}
						placeholder={"Current Grade"}
						/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.CurrentGrade)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.CurrentGrade) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
					{/* Major  */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="major">
						<Form.Label className="font-bold">Major: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMMajor} onChange={PEMSchoolMajorHandler} type="text" className="w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.Major)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.Major) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
					<hr/>
					<h3 className="text-xl mb-3 text-center">AP Capstone</h3>
					{/* AP Capstone  */}
					<div className="divide-y divide-dashed">
						<div>
							{/* AP Seminar Score  */}
							<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apseminarscore">
								<Form.Label className="font-bold">AP Seminar: </Form.Label>
								<div className="flex-grow"></div>
								<Select
								defaultValue={APSeminarScore}
								onChange={selectAPSeminarScoreSelectOptionHandler}
								options={APTestScoreOptions}
								placeholder={3}
								/>
								{
									<button onClick={(e) => {
										e.preventDefault();
										pushToNewProfileAttributes(ProfileAttributeType.APSeminarTestScore)
									}}>
										{
											newProfileAttributes.includes(ProfileAttributeType.APSeminarTestScore) ?
											<i className="fa-solid fa-eye"></i>  :
											<i className="fa-solid fa-eye-slash text-red-600"></i>
										}
									</button>
								}
							</Form.Group>
							{/* AP Research Score  */}
							<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apresearchscore">
								<Form.Label className="font-bold">AP Research: </Form.Label>
								<div className="flex-grow"></div>
								<Select
								defaultValue={APResearchScore}
								onChange={selectAPResearchScoreSelectOptionHandler}
								options={APTestScoreOptions}
								placeholder={3}
								/>
								{
									<button onClick={(e) => {
										e.preventDefault();
										pushToNewProfileAttributes(ProfileAttributeType.APResearchTestScore)
									}}>
										{
											newProfileAttributes.includes(ProfileAttributeType.APResearchTestScore) ?
											<i className="fa-solid fa-eye"></i>  :
											<i className="fa-solid fa-eye-slash text-red-600"></i>
										}
									</button>
								}
							</Form.Group>
						</div>
				
						<div className="pt-3">
							{/* AP Seminar Paper Title  */}
							<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apseminarpapertitle">
								<Form.Label className="font-bold">AP Seminar Paper Title: </Form.Label>
								<div className="flex-grow"></div>
								<Form.Control value={PEMAPSeminarPaperTitle} onChange={PEMAPSeminarPaperTitleHandler} type="text" className="w-1/2"/>
								{
									<button onClick={(e) => {
										e.preventDefault();
										pushToNewProfileAttributes(ProfileAttributeType.APSeminarPaperTitle)
									}}>
										{
											newProfileAttributes.includes(ProfileAttributeType.APSeminarPaperTitle) ?
											<i className="fa-solid fa-eye"></i>  :
											<i className="fa-solid fa-eye-slash text-red-600"></i>
										}
									</button>
								}
							</Form.Group>
							{/* AP Seminar Paper URL  */}
							<Form.Group className="mb-3 flex items-center whitespace-nowrap space-x-3" controlId="apseminarpapertitleurl">
								<Form.Label className="font-bold">AP Seminar Paper URL: </Form.Label>
								<div className="flex-grow"></div>
								<Form.Control value={PEMAPSeminarPaperURL} onChange={PEMAPSeminarPaperURLHandler} type="text" className="w-1/2" aria-describedby="apresearchpapertitleurlhelp"/>
								{
									<button onClick={(e) => {
										e.preventDefault();
										pushToNewProfileAttributes(ProfileAttributeType.APSeminarPaperURL)
									}}>
										{
											newProfileAttributes.includes(ProfileAttributeType.APSeminarPaperURL) ?
											<i className="fa-solid fa-eye"></i>  :
											<i className="fa-solid fa-eye-slash text-red-600"></i>
										}
									</button>
								}
							</Form.Group>
						</div>

						<div className="pt-3">
							{/* AP Research Paper Title  */}
							<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apresearchpapertitle">
								<Form.Label className="font-bold">AP Research Paper Title: </Form.Label>
								<div className="flex-grow"></div>
								<Form.Control value={PEMAPResearchPaperTitle} onChange={PEMAPResearchPaperTitleHandler} type="text" className="w-1/2"/>
								{
									<button onClick={(e) => {
										e.preventDefault();
										pushToNewProfileAttributes(ProfileAttributeType.APResearchPaperTitle)
									}}>
										{
											newProfileAttributes.includes(ProfileAttributeType.APResearchPaperTitle) ?
											<i className="fa-solid fa-eye"></i>  :
											<i className="fa-solid fa-eye-slash text-red-600"></i>
										}
									</button>
								}
							</Form.Group>
							{/* AP Research Paper URL  */}
							<Form.Group className="mb-3 flex flex-col whitespace-nowrap" controlId="apresearchpapertitleurl">
								<div className="flex space-x-3">
									<Form.Label className="font-bold">AP Research Paper URL: </Form.Label>
									<div className="flex-grow"></div>
									<Form.Control value={PEMAPResearchPaperURL} onChange={PEMAPResearchPaperURLHandler} type="text" className="w-1/2" aria-describedby="apresearchpapertitleurlhelp"/>
									{
										<button onClick={(e) => {
											e.preventDefault();
											pushToNewProfileAttributes(ProfileAttributeType.APResearchPaperURL)
										}}>
											{
												newProfileAttributes.includes(ProfileAttributeType.APResearchPaperURL) ?
												<i className="fa-solid fa-eye"></i>  :
												<i className="fa-solid fa-eye-slash text-red-600"></i>
											}
										</button>
									}
								</div>
								
								<Form.Text id="apresearchpapertitleurlhelp" muted>
								<i className="fa-solid fa-triangle-exclamation mr-2 text-red-500"></i> Please make sure that your links have the correct visibility permissions
								</Form.Text>
							</Form.Group>
						</div>
					</div>		
					<hr/>
					<h3 className="text-xl mb-3 text-center">Social Media</h3>
					{/* LinkedIn  */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="major">
						<Form.Label className="font-bold"><i className="fa-brands fa-linkedin"></i> LinkedIn: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMLinkedIn} onChange={PEMLinkedInHandler} type="text" className="w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.LinkedIn)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.LinkedIn) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
					{/* Instagram  */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="major">
						<Form.Label className="font-bold"><i className="fa-brands fa-instagram"></i> Instagram: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMInstagram} onChange={PEMInstagramHandler} type="text" className="w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.Instagram)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.Instagram) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
					{/* Twitter  */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="major">
						<Form.Label className="font-bold"><i className="fa-brands fa-twitter"></i> Twitter: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMTwitter} onChange={PEMTwitterHandler} type="text" className="w-1/2"/>
						{
							<button onClick={(e) => {
								e.preventDefault();
								pushToNewProfileAttributes(ProfileAttributeType.Twitter)
							}}>
								{
									newProfileAttributes.includes(ProfileAttributeType.Twitter) ?
									<i className="fa-solid fa-eye"></i>  :
									<i className="fa-solid fa-eye-slash text-red-600"></i>
								}
							</button>
                        }
					</Form.Group>
			    </Form>
	        </Modal.Body>
	        <Modal.Footer>
	          <Button variant="secondary" className="bg-red-400 hover:bg-red-500" onClick={handleEditModal}>
	            Close
	          </Button>
	          <Button variant="primary" className="bg-green-400 hover:bg-green-500" onClick={saveProfileEditChanges}>
	            Save Changes
	          </Button>
	        </Modal.Footer>
	     </Modal>
	);
}

export default ProfileEditModal;
