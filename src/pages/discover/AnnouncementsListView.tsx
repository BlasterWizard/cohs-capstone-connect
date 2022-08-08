import { updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import ProfilePicture, { ProfilePictureSize } from "../../components/ProfilePicture";
import db from "../../firebase";
import { Announcement, ProfileUser, User } from "../../Interfaces+Classes";
import { returnUserObject } from "../../HelperFunctions";

interface AnnouncementsListViewProps {
    announcements: Announcement[];
    currentUser: User | undefined;
}

export const AnnouncementsListView: React.FC<AnnouncementsListViewProps> = ({ announcements, currentUser }) => {
    return (
        <div className="mt-5 w-full">
            {
                announcements.length > 0 ?
                    <>
                        <div className="flex flex-col w-full items-center space-y-2">
                            {
                                announcements.map((announcement: Announcement, index: number) => {
                                    return <AnnouncementView announcement={announcement} currentUser={currentUser} key={index} />;
                                })
                            }
                        </div>
                    </> :
                    <h1 className="text-center text-white font-bold"> No Announcements Available</h1>
            }
        </div>
    );
}

interface AnnouncementViewProps {
    announcement: Announcement;
    currentUser: User | undefined;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ announcement, currentUser }) => {
    const [reactedUsers, setReactedUsers] = useState<User[]>([]);
    const [showPopover, setShowPopover] = useState<boolean>(false);

    useEffect(() => {
        console.log("Hello")
        fetchReactedUsers();
        console.log(reactedUsers);
    }, []);

    const updateAnnouncementLoves = async () => {
        if (currentUser?.studentDocID != undefined) {
            var newReactedUsersArr = announcement.reactedUsers;
            var newLovesCount = 0;

            if (announcement.reactedUsers.includes(currentUser?.studentDocID)) {
                newLovesCount -= 1;
                newReactedUsersArr.splice(newReactedUsersArr.indexOf(currentUser?.studentDocID), 1);
            } else {
                newLovesCount += 1;
                newReactedUsersArr.push(currentUser?.studentDocID);
            }

            await updateDoc(doc(db, "announcements", announcement.id), {
                reactedUsers: newReactedUsersArr,
                loves: newLovesCount
            });
        }
    }

    const fetchReactedUsers = () => {
        setReactedUsers([]);
        let newReactedUsers: User[] = [];
        announcement.reactedUsers.forEach(async(reactedUserDocID) => {
            let userObject = await returnUserObject(reactedUserDocID);
            if (userObject != undefined) {
                newReactedUsers.push(userObject);
            }
        });
        setReactedUsers(newReactedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName)));
    }

    const ReactedUsersPopover = (
        <Popover className="w-1/5 ml-3">
            <Popover.Header as="h3" className="flex">
                Reactions
                <div className="flex-grow"></div>
            </Popover.Header>
            <Popover.Body className="space-y-2">
                {
                    reactedUsers.map((reactedUser: User, index: number) => {
                        return <div className="flex items-center space-x-3" key={index}>
                                <ProfilePicture user={new ProfileUser(reactedUser.firstName, reactedUser.lastName, reactedUser.profile?.profilePictureURL)} size={ProfilePictureSize.Small} />
                                <span>{reactedUser.firstName} {reactedUser.lastName}</span>
                            </div>;
                    })
                }
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="flex flex-col bg-white/60 rounded-lg p-3 w-3/4 max-w-lg">
            <div className="flex items-center text-center mb-2">
                <div className="flex items-center space-x-2 w-full">
                    <ProfilePicture user={new ProfileUser(announcement.author.firstName, announcement.author.lastName, announcement.author.profileURL)} size={ProfilePictureSize.Small} />
                    <p className="font-bold text-lg text-slate-600">{announcement.author.firstName} {announcement.author.lastName}</p>
                    <div className="flex-grow"></div>
                    <p className="text-sm text-slate-500">{announcement.date.toLocaleDateString("en-US")}</p>
                </div>
            </div>
            <p className="font-bold">{announcement.title}</p>
            <p>{announcement.message}</p>
            <div className="flex">
                <div className="flex-grow"></div>
                <div className="flex space-x-2">
                    <OverlayTrigger show={showPopover && announcement.reactedUsers.length > 0} placement="right" rootClose={true} transition={true} overlay={ReactedUsersPopover} onToggle={() => setShowPopover(!showPopover)}>
                        <button onClick={updateAnnouncementLoves}>
                            {
                                announcement.reactedUsers.includes(currentUser?.studentDocID ?? "") ?
                                    <i className="fa-solid fa-heart text-red-400"></i> :
                                    <i className="fa-solid fa-heart text-slate-400"></i>
                            }
                        </button>
                    </OverlayTrigger>
                    {
                        announcement.loves > 0 && <p className="text-red-400">{announcement.loves}</p>
                    }
                </div>
            </div>
        </div>
    );
}
