import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Notifications.css';

import { axiosInstance, endpoints } from '../../core/axios';
import { STORAGE_KEYS } from '../../core/constants/KEYS';

import { NotificationComponent } from './Notification/Notification';
import { checkForNotificationsDeleted, checkForNotificationsChanges } from '../../shared/utility';

let intervalId;

export const NotificationsComponent = ({}) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [visited, setVisited] = useState(false);
    const [newNotification, setNewNotification] = useState(false);

    const showNotificationsHandler = () => {
        const currentNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.localstorage.notifications)).map((notification) => {
            notification.new = false;
            return notification;
        });
        localStorage.setItem(STORAGE_KEYS.localstorage.notifications, JSON.stringify(currentNotifications));

        setShowNotifications(prevShowNotifications => !prevShowNotifications);
        setVisited(true);
    };

    const deleteNotificationHandler = (id) => {
        const updatedNotifications = notifications.map(notifications => {
            if (notifications.id === id) {
                notifications.deleted = true;
            }

            return notifications;
        });

        setNotifications(updatedNotifications);
        localStorage.setItem(STORAGE_KEYS.localstorage.notifications, JSON.stringify(updatedNotifications));
    };

    const notificationsCount = useMemo(() => {
        return notifications.reduce((count, notification) => {
            if (!notification.deleted && notification.type !== 'bonus') {
                count++;
            }

            return count;
        }, 0);
    }, [notifications]);

    const renderNotifications = useMemo(() => {
        return notifications.map(notification => {
            return (
                <CSSTransition in={!notification.deleted}
                               appear={false}
                               key={notification.id}
                               timeout={notification.expires ? notification.expires : Infinity}
                               classNames={'NotificationAnimate'}
                               mountOnEnter
                               unmountOnExit>
                    <NotificationComponent key={notification.id}
                                  notification={notification}
                                  deleteHandler={deleteNotificationHandler}
                                  class={'Notify-item ' + notification.type}/>
                </CSSTransition>
            );
        });
    }, [notifications]);

    const fetchNotifications = useCallback(() => {
        axiosInstance.get(endpoints.files.notificationsJSON)
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
                let localStorageNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.localstorage.notifications));
                if (!localStorageNotifications) {
                    localStorage.setItem(STORAGE_KEYS.localstorage.notifications, JSON.stringify(fetchedNotifications));
                    isNewNotification = true;
                    setNotifications(fetchedNotifications);
                    setNewNotification(isNewNotification)
                } else {
                    //Check for deleted notification on server and return a new array
                    localStorageNotifications = checkForNotificationsDeleted(fetchedNotifications); // accepts response data

                    let areNotificationsChanged = checkForNotificationsChanges(fetchedNotifications, localStorageNotifications, isNewNotification);

                    //If new notifications is found sets the correct states
                    if (areNotificationsChanged.hasChangedGlobal) {
                        localStorage.setItem(STORAGE_KEYS.localstorage.notifications, JSON.stringify(areNotificationsChanged.checkedNotificationsArr));
                        setNewNotification(areNotificationsChanged.isNewNotification);
                        setVisited(false)
                    }

                    setNotifications(areNotificationsChanged.checkedNotificationsArr);
                }
            })
            .catch(error => {
                console.log('something went wrong on get', { error });
            });
    }, []);

    useEffect(() => {
        fetchNotifications()

        intervalId = setInterval(() => fetchNotifications(), 10000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <>
            < div className="right Navigation-right">
                <div className="Notifications-wrapper">
                    <p className={`Notification-counter ${!visited && newNotification ? 'NewNotifications' : ''}`}>{notificationsCount}</p>
                    <div className="material-icons right Notification-material-icon"
                         onClick={showNotificationsHandler}>notifications
                    </div>
                    <div className={`Notification-wrapper ${showNotifications ? 'NotificationsShow' : ''}`}>
                        <div className="Inner-head">
                            <h6 className="Inner-head-title">NOTIFICATIONS</h6>
                        </div>
                        <TransitionGroup className="Inner-Notification-wrapper">
                            {renderNotifications}
                        </TransitionGroup>
                    </div>
                </div>
            </div>
            <div className="NotificationsOverlay-wrapper">
                <TransitionGroup className="Inner-Notification-wrapper NotificationsOverlay-group">
                    {renderNotifications}
                </TransitionGroup>
            </div>
        </>
    );
};
