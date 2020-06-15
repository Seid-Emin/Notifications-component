import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';

import Notification from './Notification/Notification';
import { checkForNotificationsDeleted, checkForNotificationsChanges } from '../../shared/utility';

import './Notifications.css';

class Notifications extends Component {
    state = {
        notifications: [],
        showNotifications: false,
        visited: false,
        notifDeleted: false,
        isNewNotif: false
    }

    componentDidMount() {
        //load data on initial start only
        this.loadData();

        //Simulate a polling, repeated reguest to server to check for new or updated/deleted notifications
        this.intervalId = setInterval(() => this.loadData(), 10000);
    }

    componentWillUnmount() {
        //clear the interval when/if component unmounts
        clearInterval(this.intervalId);
    }

    //Get server response data
    //Go through all checks:
    //compare the data on initial start
    //sets it in local storage for further response data chansed
    //sets the state corresponding to data
    loadData() {
        axios.get('https://notifications-7fe85.firebaseio.com/.json')
            .then(res => {
                let isNewNotification = false;
                const fetchedNotifications = [];
                for (let key in res.data) {
                    if (res.data[key]) {
                        fetchedNotifications.push({
                            ...res.data[key],
                            new: true,
                            deleted: false,
                            hasChanged: true
                        });
                    }
                }

                //Check and Initialise local storage key for notifications
                let localStorageNotifications = JSON.parse(localStorage.getItem('notifications'));
                if (localStorageNotifications === null) {
                    localStorage.setItem('notifications', JSON.stringify(fetchedNotifications));
                    isNewNotification = true;
                    this.setState({ notifications: fetchedNotifications, isNewNotif: isNewNotification });
                }

                //Check for deleted notification on server and return a new array
                localStorageNotifications = checkForNotificationsDeleted(fetchedNotifications); // accepts response data

                //Compares the response data with current stored date of notifications
                //Adds, updates and removes
                //returns object with updated notifications info in an Array
                //updates local storage according to server changes and sets it local storage
                //return a boolean showing the state of notifications (new/old)
                let areNotificationsChanged = checkForNotificationsChanges(fetchedNotifications, localStorageNotifications, isNewNotification);

                //If new notifications is found sets the correct states 
                if (areNotificationsChanged.hasChangedGlobal) {
                    localStorage.setItem('notifications', JSON.stringify(areNotificationsChanged.checkedNotifArr));
                    this.setState({ notifications: areNotificationsChanged.checkedNotifArr, isNewNotif: areNotificationsChanged.isNewNotification, visited: false });
                }
                this.setState({ notifications: areNotificationsChanged.checkedNotifArr });
            })
            .catch(error => { console.log('something went wrong on get') });
    }

    // open/hide notifications window
    showNotificationsHandler = () => {
        let localStorageNotifications = JSON.parse(localStorage.getItem('notifications'));
        let currentNotifications = [...localStorageNotifications];

        currentNotifications = currentNotifications.map((notification) => {
            notification.new = false;
            return notification
        })
        this.setState({
            showNotifications: !this.state.showNotifications,
            visited: true,
            notifications: currentNotifications
        });
        localStorage.setItem('notifications', JSON.stringify(currentNotifications));
    }

    //Delete notification on user click
    //Also passed to Notification.js in which is called after each expire time is passed ( if has any )
    deleteNotificationHandler = (id) => {
        const notifArr = this.state.notifications;
        const updatedNotif = [];
        notifArr.map(notif => {
            if (notif.id === id) {
                notif.deleted = true;
            }
            return updatedNotif.push(notif);
        });
        this.setState({ notifications: updatedNotif });
        localStorage.setItem('notifications', JSON.stringify(updatedNotif));
    }

    render() {
        //show correct count of existing notifications
        let count = 0;

        //change badge color on when the notifications are read
        let badgeClasses = ['Notification-counter'];
        if ((!this.state.visited && this.state.isNewNotif)) {
            badgeClasses.push('NewNotifications');
        }

        //animate notifications on click
        let notificationsWrapper = ['Notification-wrapper'];
        if (this.state.showNotifications) {
            notificationsWrapper.push('NotificationsShow');
        }

        //Loop through all notification from store and display them
        //Ckech if it is a 'bonus' and is not deleted and/or updated
        let notifications = this.state.notifications.map(notification => {
            if (!notification.deleted) {
                if (notification.type !== 'bonus') {
                    count++;
                }
            }
            return <CSSTransition
                in={!notification.deleted}
                appear={false}
                key={notification.id}
                timeout={notification.expires ? notification.expires : Infinity}
                classNames="NotificationAnimate"
                mountOnEnter
                unmountOnExit >
                <Notification
                    key={notification.id}
                    notification={notification}
                    delete={this.deleteNotificationHandler}
                    class={'Notify-item ' + notification.type} />
            </CSSTransition>
        });

        return (
            <React.Fragment>
                < div className="right Navigation-right" >
                    <div className='Notifications-wrapper'>
                        <p className={badgeClasses.join(' ')}>{count}</p>
                        <div className="material-icons right Notification-material-icon" onClick={this.showNotificationsHandler}>notifications</div>
                        <div className={notificationsWrapper.join(' ')}>
                            <div className='Inner-head'>
                                <h6 className='Inner-head-title'>NOTIFICATIONS</h6>
                            </div>
                            <TransitionGroup className='Inner-Notification-wrapper'>
                                {notifications}
                            </TransitionGroup>
                        </div>
                    </div>
                </div >
                <div className='NotificationsOverlay-wrapper'>
                    <TransitionGroup className='Inner-Notification-wrapper NotificationsOverlay-group'>
                        {notifications}
                    </TransitionGroup>
                </div>
            </React.Fragment>
        )
    }
}

export default Notifications;
