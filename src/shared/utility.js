// used in Notifications.js
// Accepts
export const checkForNotificationsDeleted = (apiResponce) => {
    let localStorageNotifications = JSON.parse(localStorage.getItem('notifications'));
    let checkForDeletedNotifications = localStorageNotifications;
    let newArrForNotifications = [];
    for (let i in checkForDeletedNotifications) {
        let isDeleted = apiResponce.findIndex(fetched => fetched.id === checkForDeletedNotifications[i].id);
        if (isDeleted >= 0) {
            newArrForNotifications.push(checkForDeletedNotifications[i]);
        }
    }
    localStorage.setItem('notifications', JSON.stringify(newArrForNotifications));
    return newArrForNotifications;
};



// Accepts Response data/fetchedNotifications, localStorageNotifications and a boolean contriling the new/old state of notification
// Returns a new Array with correct state of notification
export const checkForNotificationsChanges = (fetchedNotifications, localStorageNotifications, isNewNotification) => {
    let hasChangedGlobal = false;

    let checkedNotifArr = [];
    fetchedNotifications.map(fetchedNotif => {
        let existingNotification = localStorageNotifications.find(localNotif => localNotif.id === fetchedNotif.id);
        if (existingNotification) {
            switch (existingNotification.type) {
                case 'text':
                    if (existingNotification.text === fetchedNotif.text
                        && existingNotification.title === fetchedNotif.title) {
                        existingNotification.hasChanged = false;
                        if (existingNotification.new) {
                            isNewNotification = true;
                        }
                        checkedNotifArr.push(existingNotification);
                    } else {
                        existingNotification.hasChanged = true;
                        hasChangedGlobal = true;
                        checkedNotifArr.unshift(fetchedNotif);
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
                        checkedNotifArr.push(existingNotification);
                    } else {
                        existingNotification.hasChanged = true;
                        hasChangedGlobal = true;
                        checkedNotifArr.unshift(fetchedNotif);
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
                        checkedNotifArr.push(existingNotification);
                    } else {
                        existingNotification.hasChanged = true;
                        hasChangedGlobal = true;
                        checkedNotifArr.unshift(fetchedNotif);
                        isNewNotification = true;
                    }
                    break;
                default:
                    break;
            }
        } else {
            checkedNotifArr.unshift(fetchedNotif);
            isNewNotification = true;
        }

        //Add new notifications if none is found in localStorage at the begining
        let addIfNewNotificationComes = localStorageNotifications.findIndex(localNotif => localNotif.id === fetchedNotif.id);
        if (addIfNewNotificationComes < 0) {
            checkedNotifArr.unshift(fetchedNotif);
            isNewNotification = true;
        }
        return checkedNotifArr;
    });
    return { checkedNotifArr: checkedNotifArr, isNewNotification: isNewNotification, hasChangedGlobal: hasChangedGlobal }
};