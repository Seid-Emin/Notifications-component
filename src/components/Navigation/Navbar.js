import React from 'react';
import './Navbar.css';

import { NotificationsComponent } from '../Notifications/Notifications';


const navbar = () => {
    return (
        <nav>
            <div className={'nav-wrapper LightBlue'}>
                <div className={'brand-logo center Position'}>Logo</div>
                <NotificationsComponent />
            </div>
        </nav>
    );
}

export default navbar;
