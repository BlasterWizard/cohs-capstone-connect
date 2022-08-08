import { updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ProfilePicture, { ProfilePictureSize } from "../../../components/ProfilePicture";
import db from "../../../firebase";
import { User, ProfileUser } from "../../../Interfaces+Classes";
import toast from "react-hot-toast";

interface ManageAdminsViewProps {
    users: User[];
}

export const ManageAdminsView: React.FC<ManageAdminsViewProps> = ({users}) => {
    const [admins, setAdmins] = useState<User[]>([]);
    const [showAddAdminsModal, setShowAddAdminsModal] = useState(false);
    const toggleShowAddAdminsModal = () => setShowAddAdminsModal(!showAddAdminsModal);

    useEffect(() => {
        setAdmins(users.filter(user => user.isAdmin));
    }, [users]);

    async function reverseAdminStatus(admin: User) {
        await updateDoc(doc(db, "users", admin.studentDocID), {
            isAdmin: !admin.isAdmin
        }).then(() => {
            toast.success("Admin Demoted");
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    return (
        <div className="flex flex-col bg-white/60 rounded-lg p-2 w-3/4 items-center max-w-2xl">
            <h2 className="text-center font-bold text-xl">Manage Admins</h2>
            <div className="flex flex-col items-center space-y-2 m-2 w-full">
            {
                admins.map((admin: User, index: number) => (
                    <div className="bg-white/60 w-3/4 max-w-lg p-2 rounded-md flex text-center items-center" key={index}>
                        <div className="space-x-3 flex items-center">
                            <ProfilePicture user={new ProfileUser(admin.firstName, admin.lastName, admin.profile?.profilePictureURL)} size={ProfilePictureSize.Small}/>
                            <p className="font-bold">{admin.firstName} {admin.lastName}</p>
                        </div> 
                        <div className="flex-grow"></div>
                        <button className="bg-red-300 hover:bg-red-400 w-8 h-8 rounded-full" onClick={() => reverseAdminStatus(admin)}><i className="fa-solid fa-xmark text-white"></i></button>
                    </div>
                ))
            }
            </div>
            <button className="bg-emerald-300 font-bold text-white p-2 rounded-lg w-fit" onClick={toggleShowAddAdminsModal}>Add Admin</button>
            <AddAdminsModal showModal={showAddAdminsModal} hideModal={toggleShowAddAdminsModal} users={users}/>
        </div>
    );
;}

interface AddAdminsModalProps {
    showModal: boolean;
    hideModal: () => void;
    users: User[];
}

export const AddAdminsModal: React.FC<AddAdminsModalProps> = ({ showModal, hideModal, users }) => {
    const [adminsToAdd, setAdminsToAdd] = useState<User[]>([]);
    const [confirmAdmins, setConfirmAdmins] = useState<User[]>([]);

    useEffect(() => {
        setAdminsToAdd(users.filter(user => !user.isAdmin && user.approvalStatus.isApproved).sort((a, b) => a.lastName.localeCompare(b.lastName)));
        setConfirmAdmins([]);
    }, [users]);

    const addUserToAdminsToAdd = (user: User) => {
        setConfirmAdmins(confirmAdmins => [...confirmAdmins, user]);
        setAdminsToAdd(adminsToAdd.filter((admin) => admin.studentUID != user.studentUID));
    }

    const removeUserFromAdminsToAdd = (user: User) => {
        setConfirmAdmins(confirmAdmins.filter((admin) => admin.studentUID != user.studentUID));
        setAdminsToAdd(adminsToAdd => [...adminsToAdd, user]);
    }

    async function confirmAdminsToAdd() {
        console.log(confirmAdmins);
        confirmAdmins.forEach(async (admin: User) => {
            await updateDoc(doc(db, "users", admin.studentDocID), {
                isAdmin: true
            });
        });
        hideModal();
    }

    return (
        <Modal
        size="lg"
        show={showModal}
        centered
      >
        <Modal.Header className="flex items-center">
          <Modal.Title>Add Admins</Modal.Title>
          <button className="bg-gray-300/60 rounded-full px-2 py-0.3 text-slate-400" onClick={hideModal}><i className="fa-solid fa-xmark"></i></button>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center space-y-3">
            {
                adminsToAdd.length > 0 ? 
                adminsToAdd.map((user: User, index: number) => (
                    <div className="bg-slate-300/60 w-3/4 max-w-lg p-2 rounded-md flex text-center items-center" key={index}>
                        <div className="space-x-3 flex items-center">
                            <ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Small}/>
                            <p className="font-bold">{user.firstName} {user.lastName}</p>
                        </div> 
                        <div className="flex-grow"></div>
                        <button className="bg-emerald-300 hover:bg-emerald-400 w-8 h-8 rounded-full" onClick={() => addUserToAdminsToAdd(user)}>
                            <i className="fa-solid fa-plus text-white"></i>
                        </button>
                    </div> 
                )) :
                    confirmAdmins.length < 0 &&  <p>No Users Found</p>
            }
        </Modal.Body>
        <Modal.Footer>
            {
                confirmAdmins.length > 0  &&
                <div className="flex flex-col w-full">
                    <p className="font-bold">Confirm New Admins:</p>
                    <div className="grid grid-flow-row grid-cols-4 space-x-5 mb-3">
                        {
                            confirmAdmins.map((user: User, index: number) => (
                                <div className="flex whitespace-nowrap bg-violet-100 p-1 rounded-lg items-center space-x-2 w-fit" key={index}>
                                    <p>{user.firstName} {user.lastName}</p>
                                    <button className="bg-red-300 hover:bg-red-400 w-5 h-5 rounded-full text-sm" onClick={() => removeUserFromAdminsToAdd(user)}>
                                        <i className="fa-solid fa-xmark text-white"></i>
                                    </button>
                                </div>
                                
                            ))
                        }
                    </div>
                    
                    <div className="flex">
                        <div className="flex-grow"></div>
                        <Button variant="primary" className="bg-green-400 hover:bg-green-500 font-bold w-fit" onClick={confirmAdminsToAdd}>
                        Add
                        </Button>
                    </div>      
                </div> 
            }
            
	     </Modal.Footer>
      </Modal>
    );
}
