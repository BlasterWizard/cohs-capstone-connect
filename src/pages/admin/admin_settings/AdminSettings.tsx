import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import UnauthorizedAccess from "../../Special Pages/UnauthorizedAccess";
import { User } from "../../../Interfaces+Classes";
import { AddAdminsModal, ManageAdminsView } from "./ManageAdminsView";

interface AdminSettingsProps {
    users: User[];
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ users }) => {
    return (
        <>
            {
                (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
                ? 
                (users.length === undefined) ?
                <Spinner animation="border" /> :
                <AdminSettingsView users={users}/>
                :
                <UnauthorizedAccess />
            }
        </>
    );
}

const AdminSettingsView: React.FC<AdminSettingsProps> = ({ users }) => {
    return (
        <>
            <h1 className="text-3xl font-bold mb-3">Settings</h1>
            <ManageAdminsView users={users}/>
        </>
    );
}

export default AdminSettings;