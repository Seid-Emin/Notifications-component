import React from 'react';

import Notifications from '../../containers/Notifications/Notifications';

import './Navbar.css';

const navbar = () => {
    return (
        <nav>
            <div className="nav-wrapper LightBlue">
                <div className="brand-logo center Position">Logo</div>
                <Notifications />
            </div>
        </nav>
    );
}

export default navbar;