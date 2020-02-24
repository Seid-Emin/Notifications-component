import React, { Component } from 'react';

import './Notification.css';

class Notification extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     deleted: false, //for animation purposes only        / exiting animation control
        //     expired: false, //maintainign the removing on expire / exiting animation control
        //     // unmount: false, //maintainign the removing on expire / exiting animation control
        // }
        this.deleteNotificationHandler = this.deleteNotificationHandler.bind(this);
    }

    //Start of extra code

    //From here till deleteNotificationHandler are writen only cuz a bug in CSSTransition group
    //If you delete these line will still work as intended expet the exiting animations will be missing
    //also if you want to try it delete in the switch case the second addedclass, again using for exiting animation
    //will update when a proper solution is found
    componentDidMount() {
        if (this.props.notification.expires) {
            setTimeout(() => {
                let updatedNotification = { ...this.props.notification };
                updatedNotification.deleted = true;
                // this.setState({ expired: true, deleted: true, notification: updatedNotification });
                this.props.delete(this.props.notification.id);
            },
                this.props.notification.expires ? this.props.notification.expires : null);
        }
    }

    componentDidUpdate() {
        console.log('i update from notification didupdate');

        //     let getNotifications = JSON.parse(localStorage.getItem('notifications'));
        //     let updateNotification = [...getNotifications];
        //     let currentNotif = updateNotification.findIndex(notif => notif.id === this.props.notification.id);
        //     if (this.state.expired || this.state.unmount) {
        //         updateNotification[currentNotif].deleted = true;
        //         updateNotification[currentNotif].new = false;
        //         localStorage.setItem('notifications', JSON.stringify(updateNotification));
        //         return updateNotification[currentNotif];
        //     }
        //     if (this.props.visited) {
        //         setTimeout(() => {
        //             updateNotification[currentNotif].new = false;
        //             localStorage.setItem('notifications', JSON.stringify(updateNotification));
        //             return updateNotification[currentNotif];
        //         }, 2500)

        //     }
        //     if (this.props.notification.new && !this.props.visited) {
        //         updateNotification[currentNotif].new = true;
        //         localStorage.setItem('notifications', JSON.stringify(updateNotification));
        //         return updateNotification[currentNotif];
        //     }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.notification.hasChanged) {
            return true;
        }

        if (this.props.notification.deleted) {
            return true;
        }
        return false;
    }

    //End

    //get current params and pass them to Notifications.js to execute delete
    deleteNotificationHandler = () => {
        this.props.delete(this.props.notification.id);
    }

    render() {
        //variable for maintainance
        let propsNotification = this.props.notification;

        //removing 'New' if the notifications is old or already seen
        let isNew = ['NewNotif'];
        if (!propsNotification.new) {
            isNew.push('Hide');
        }

        //controls the FadeOut process of the notification acording the conditions
        // let expireFadeOut = this.state.expired && this.state.notification.expires ? ' FadeOut' : '';

        let notification = null; //initial set of variable for controled render acording passed props
        if (!propsNotification.deleted) {
            switch (propsNotification.type) {
                case 'text':
                    notification = (
                        <div className={this.props.class} >
                            <p className={isNew.join(' ')}>new</p>
                            <div className='Notify-title'>{propsNotification.title}</div>
                            <div className='Notify-text'>{propsNotification.text}</div>
                            <div type='button' className='material-icons Nofity-delete' onClick={this.deleteNotificationHandler} >delete_forever</div>
                        </div>
                    )
                    break;

                case 'bonus':
                    notification = (
                        <div className={this.props.class} >
                            <p className={isNew.join(' ')}>new</p>
                            <div className='Notify-title Bonus-title'>{propsNotification.title}</div>
                            <div className='Notify-text Bonus-text'>{propsNotification.requirement}</div>
                            <div type='button' className='material-icons Nofity-delete' onClick={this.deleteNotificationHandler} >delete_forever</div>
                        </div>
                    )

                    break;
                case 'Promotion':
                    notification = (
                        <div className={this.props.class} >
                            <p className={isNew.join(' ')}>new</p>
                            <img className='Notification-img Promotion-img' src={propsNotification.image} alt={propsNotification.image} />
                            <a href={propsNotification.link} className='Notify-text Promotion-text' >
                                <div className='Notify-title Promotion-title'>{propsNotification.title}</div>
                            </a>
                            <div type='button' className='material-icons Nofity-delete' onClick={this.deleteNotificationHandler} >delete_forever</div>
                        </div>
                    )
                    break;

                default:
                    notification = '';
                    break;
            }
        }

        return (
            <React.Fragment>
                {notification}
            </React.Fragment>
        )
    }
}

export default Notification;