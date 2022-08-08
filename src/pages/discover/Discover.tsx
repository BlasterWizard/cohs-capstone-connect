import React, { useEffect, useState } from "react";
import { User, CohortGroup, ProfileUser} from "../../Interfaces+Classes";
import ProfilePicture, { ProfilePictureSize } from "../../components/ProfilePicture";
import { determineCohortGroups } from "../../HelperFunctions";
import { Modal } from "react-bootstrap";
import UnauthorizedAccess from "../Special Pages/UnauthorizedAccess";
import DiscoverPagination from "../../components/DiscoverPagination";
import { Outlet, useLocation } from "react-router-dom";



const Discover = () => {
	let location = useLocation();
	
  return (
    <>
      <main>
        {
            (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
              ? 
				<>
					<DiscoverPagination pageLocation={location.pathname.substring(10)}/>
					<Outlet />
				</>
              :
              <UnauthorizedAccess/>
        }
      </main>
    </>
  );
};

interface CohortGroupsViewProps {
  users: User[];
}

export const CohortGroupsView: React.FC<CohortGroupsViewProps> = ({ users }) => {
	const [cohortGroups, setCohortGroups] = useState<CohortGroup[]>([]);

	useEffect(() => {
		setCohortGroups(determineCohortGroups(users));
	}, [users]);

  return (
    <>
      {
        cohortGroups.map((cohortGroup: CohortGroup, index: number) => {
          return <div key={index} className="m-5 w-full space-y-5">
            <h3 className="font-bold text-3xl text-white">{cohortGroup.year}</h3>
            <DiscoverUsersView users={cohortGroup.users}/>
            {
              (index === cohortGroups.length) &&  <hr/>
            }
          </div>
        })
      }
    </>
  );
}

interface DiscoverUsersViewProps {
  users: User[];
}

const DiscoverUsersView: React.FC<DiscoverUsersViewProps> = ({ users }) => {
  const [gridClassname, setGridClassname] = useState<string>("");

  useEffect(() => {
    determineCorrectGridClassname();
  }, [users]);

  function determineCorrectGridClassname() {
    if (users.length == 1) {
      setGridClassname("grid grid-cols-1 gap-5 w-fit");
    } else if (users.length == 2) {
      setGridClassname("grid grid-cols-2 gap-5 w-fit");
    } else {
      setGridClassname("grid grid-cols-3 gap-5 w-fit");
    }
  }

  return (
    <div className={gridClassname}>
      {
        users.map((user: User, index: number) => {
          return <DiscoverUserView user={user} key={index} />
        })
      }
    </div>
  );
}

interface DiscoverUserViewProps {
  user: User;
}

const DiscoverUserView: React.FC<DiscoverUserViewProps> = ({ user }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const toggleShowUserProfile = () => { setShowUserProfile(!showUserProfile) };

  return (
    <>
      <button onClick={() => {
		setShowUserProfile(!showUserProfile);
      }}>
        <div className="bg-white/60 h-fit w-48 p-3 rounded-md flex flex-col text-center">
            <ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Large}/>
            <p className="font-bold mt-3">{user.firstName} {user.lastName}</p>
            {/* <p>{user.profile?.graduatingYear}</p> */}
        </div>
      </button>
      <DiscoverUserProfileModalView user={user} showModal={showUserProfile} manageModal={toggleShowUserProfile} />
    </>
  );
}

interface DiscoverUserProfileModalViewProps {
  user: User;
  showModal: boolean;
  manageModal: () => void;
}

const DiscoverUserProfileModalView: React.FC<DiscoverUserProfileModalViewProps> = ({ user, showModal, manageModal }) => {

  // const PVEmailView = () => {
	// 	const isVisible = user.profile?.visibleAttributes.includes("Email");
	// 	return (
	// 		<>
 	// 			{
	// 				(isVisible) &&
	// 				<div className="flex items-center">
	// 					<p><span className="font-bold">Email: </span>
	// 						{user?.email === undefined || user?.email === "" ?
	// 						<span className="text-red-500">Can't Find User's Email</span> :
	// 						user?.email
	// 						}
	// 					</p>	
	// 				</div>
	// 			}
	// 		</>
	// 	);
	// };

	const PVPhoneNumberView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("PhoneNumber");
		return (
			<>
				{
					(isVisible) &&
					<div className="flex items-center">
						<p><span className="font-bold">Phone: </span>
							{user?.profile?.phoneNumber === undefined ||  user?.profile?.phoneNumber === ""  ? 
							<span className="text-red-500">Phone Number Not Found</span> :
							user?.profile?.phoneNumber
							}
						</p>
					</div>
					
				}
			</>
		);
	}

	const PVCollegeView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("College");
		return (
			<>
				{
					(isVisible) &&
					<div className="flex items-center">
						<p><span className="font-bold">College: </span>
							{user?.profile?.school === undefined ||  user?.profile?.school === ""  ? 
							<span className="text-red-500">School Not Found</span> :
							user?.profile?.school
							}
						</p>
					</div>
				
				}
			</>
		);
	}

	const PVCurrentGradeView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("CurrentGrade");
		return (
			<>
				{
					(isVisible) && 
					<div className="flex items-center">
						<p><span className="font-bold">Current Grade: </span>
							{user?.profile?.grade === undefined ||  user?.profile?.grade === ""  ? 
							<span className="text-red-500">Grade Not Found</span> :
							user?.profile?.grade
							}
						</p>
					</div>
				}
			</>
		);
	}

	const PVMajorView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("Major");
		return (
			<>
				{
					(isVisible) && 
					<div className="flex items-center">
						<p><span className="font-bold">Major: </span>
							{user?.profile?.major === undefined ||  user?.profile?.major === ""  ? 
							<span className="text-red-500">Major Not Found</span> :
							user?.profile?.major
							}
						</p>
					</div>
				}
			</>
		);
	}

	const PVAPSeminarTestScoreView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("APSeminarTestScore");
		return (
			<>
				{
					(isVisible) &&
					<div className="flex items-center">
						<p><span className="font-bold">AP Seminar Test Score: </span>
							{user?.profile?.apInfo?.APSeminarScore === undefined ||  user?.profile?.apInfo.APSeminarScore === 0  ? 
							<span className="text-red-500">AP Seminar Score Not Found</span> :
							user?.profile?.apInfo?.APSeminarScore
							}
						</p>
					</div>
				}
			</>
		);
	}

	const PVAPResearchTestScoreView = () => {
		const isVisible = user.profile?.visibleAttributes.includes("APResearchTestScore");
		return (
			<>
				{
					(isVisible) && 
					<div className="flex items-center">
						<p><span className="font-bold">AP Research Test Score: </span>
							{user?.profile?.apInfo?.APResearchScore === undefined ||  user?.profile?.apInfo.APResearchScore === 0  ? 
							<span className="text-red-500">AP Research Score Not Found</span> :
							user?.profile?.apInfo?.APResearchScore
							}
						</p>
					</div>
				}
			</>
		);
	}

	const PVAPResearchPaperLink = () => {
		const isVisible = user.profile?.visibleAttributes.includes("APResearchPaperURL");
		return (
			<>
				{
					(isVisible) && 
					<div className="flex items-center">
						<p>
							<span className="font-bold">AP Research Paper Link: </span> 
							{
								user?.profile?.apInfo?.APResearchPaperURL == undefined || user?.profile?.apInfo?.APResearchPaperURL === "" ? 
								<span className="text-red-500">AP Research Paper Link Not Found</span>:
								<a href={user?.profile?.apInfo?.APResearchPaperURL} target="_blank">
								<span className="bg-gray-200 py-1 px-2 rounded-lg"><i className="fa-solid fa-link"></i> {user?.profile?.apInfo?.APResearchPaperTitle}</span>
							</a>
							}
						</p>
					</div>
				}
			</>
		);
	}
  
  return (
    <Modal show={showModal} onHide={manageModal} size="lg">
      <Modal.Header className="flex">
	  	<Modal.Title>{user.firstName + " " + user.lastName + "'s"} Profile</Modal.Title>
        <div className="flex-grow"></div>
        <button className="bg-slate-200/60 hover:bg-slate-300/60 rounded-full px-2 py-0.3 text-slate-400" onClick={manageModal}><i className="fa-solid fa-xmark"></i></button>
      </Modal.Header>
      <Modal.Body className="flex justify-center">
        <div className="bg-blue-300/60 rounded-md p-10 w-full flex flex-col focus:outline-none max-w-3xl min-w-fit shadow-sm shadow-gray-500">
			{/* Profile Image */}
			<ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Large} />
			<h1 className="text-center mt-2 text-2xl font-bold text-slate-500">{user.firstName + " " + user.lastName}</h1>
			<div className="flex flex-col mt-4">
				<p className="text-xl text-center font-bold m-2">Personal Info</p>
				<p><span className="font-bold">First Name: </span>{user?.firstName ?? "Can't Find User's First Name"}</p>
				<p><span className="font-bold">Last Name: </span>{user?.lastName ?? "Can't Find User's Last Name"}</p>
				<p><span className="font-bold">Graduating Year: </span>{user?.profile?.graduatingYear ?? "Can't Find User's Graduating Year"}</p>
				<PVPhoneNumberView/>
				{/* <PVEmailView/> */}
			</div>
			<div className="flex flex-col">
				<PVCurrentGradeView/>
				<PVCollegeView/>		
				<PVMajorView/>			
			</div>
			
			<div className="flex flex-col">
				<PVAPSeminarTestScoreView/>
				<PVAPResearchTestScoreView/>
				<PVAPResearchPaperLink/>
			</div>
		</div>
      </Modal.Body>
    </Modal>
  );
}

export default Discover;


