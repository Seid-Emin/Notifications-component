import { STORAGE_KEYS } from '../core/constants/KEYS';

// used in Notifications.js
// Accepts
export const checkForNotificationsDeleted = (response) => {
    const checkForDeletedNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.localstorage.notifications));
    const newNotificationsArr = [];
    for (let i in checkForDeletedNotifications) {
        let isDeleted = response.findIndex(fetched => fetched.id === checkForDeletedNotifications[i].id);
        if (isDeleted >= 0) {
            newNotificationsArr.push(checkForDeletedNotifications[i]);
        }
    }

    localStorage.setItem(STORAGE_KEYS.localstorage.notifications, JSON.stringify(newNotificationsArr));

    return newNotificationsArr;
};



// Accepts Response data/fetchedNotifications, localStorageNotifications and a boolean contriling the new/old state of notification
// Returns a new Array with correct state of notification
export const checkForNotificationsChanges = (fetchedNotifications, localStorageNotifications, isNewNotification) => {
    let hasChangedGlobal = false;

    const checkedNotificationsArr = [];
    fetchedNotifications.map(fetchedNotif => {
        const existingNotification = localStorageNotifications.find(localNotif => localNotif.id === fetchedNotif.id);

        if (existingNotification) {
            switch (existingNotification.type) {
                case 'text':
                    if (existingNotification.text === fetchedNotif.text
                        && existingNotification.title === fetchedNotif.title) {
                        existingNotification.hasChanged = false;
                        if (existingNotification.new) {
                            isNewNotification = true;
                        }
                        checkedNotificationsArr.push(existingNotification);
                    } else {
                        hasChangedGlobal = true;
                        checkedNotificationsArr.unshift(fetchedNotif);
                        isNewNotification = true;
                    }
                    break;
                case 'bonus':
                    if (existingNotification.title === fetchedNotif.title
                        && existingNotification.requirement === fetchedNotif.requirement) {
                        existingNotification.hasChanged = false;
                        if (existingNotification.new) {
                            isNewNotification = true;
                        }
                        checkedNotificationsArr.push(existingNotification);
                    } else {
                        hasChangedGlobal = true;
                        checkedNotificationsArr.unshift(fetchedNotif);
                        isNewNotification = true;
                    }
                    break;
                case 'Promotion':
                    if (existingNotification.title === fetchedNotif.title
                        && existingNotification.image === fetchedNotif.image
                        && existingNotification.link === fetchedNotif.link) {
                        existingNotification.hasChanged = false;
                        if (existingNotification.new) {
                            isNewNotification = true;
                        }
                        checkedNotificationsArr.push(existingNotification);
                    } else {

                        hasChangedGlobal = true;
                        checkedNotificationsArr.unshift(fetchedNotif);
                        isNewNotification = true;
                    }
                    break;
                default:
                    break;
            }
        } else {
            checkedNotificationsArr.unshift(fetchedNotif);
            isNewNotification = true;
        }

        //Add new notifications if none is found in localStorage at the beginning
        const addIfNewNotificationComes = localStorageNotifications.findIndex(localNotif => localNotif.id === fetchedNotif.id);
        if (addIfNewNotificationComes < 0) {
            checkedNotificationsArr.unshift(fetchedNotif);
            isNewNotification = true;
        }
        return checkedNotificationsArr;
    });
    return { checkedNotificationsArr, isNewNotification, hasChangedGlobal }
};
