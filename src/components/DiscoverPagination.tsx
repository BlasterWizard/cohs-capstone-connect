import React, { useEffect } from 'react';
//import Components
import Nav from 'react-bootstrap/Nav';

export interface DiscoverPaginationProps {
    pageLocation: string;
}

export enum DiscoverPaginationKeys {
    Announcements = "announcements",
    Explore = "explore",
}

const DiscoverPagination: React.FC<DiscoverPaginationProps> = ({pageLocation}) => {
    return (  
        <div className="bg-white/60 p-1 rounded-lg">
            <Nav variant="pills" defaultActiveKey={pageLocation}>
                <Nav.Item>
                    {
                        pageLocation === DiscoverPaginationKeys.Announcements ? 
                        <Nav.Link eventKey="announcements" href="/discover/announcements" className="font-bold"><i className="fa-solid fa-bullhorn text-white/80"></i> Announcements</Nav.Link>
                        :
                        <Nav.Link eventKey="announcements" href="/discover/announcements">Announcements</Nav.Link>
                    }
                    
                </Nav.Item>
                <Nav.Item>
                    {
                        pageLocation === DiscoverPaginationKeys.Explore ?
                        <Nav.Link eventKey="explore" href="/discover/explore" className="font-bold"><i className="fa-solid fa-users text-white/80"></i> Explore</Nav.Link>
                        :
                        <Nav.Link eventKey="explore" href="/discover/explore">Explore</Nav.Link>
                    }

                </Nav.Item>
            </Nav>
        </div>
    );
}
 
export default DiscoverPagination;;