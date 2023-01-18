import React, { useEffect } from 'react';
import './Notification.css';


export const NotificationComponent = ({ deleteHandler, notification }) => {

    useEffect(() => {
        notification.expires && setTimeout(() => deleteHandler(notification.id), notification.expires);
    }, []);

    return (
        <>
            {!notification.deleted
                ? (
                    <div className={`Notify-item ${notification.type}`}>
                        <p className={`NewNotif ${!notification.new ? 'Hide' : ''}`}>new</p>
                        {
                            !notification.link &&
                            <div className={`Notify-title ${notification.type}-title`}>
                                {notification.title}
                            </div>
                        }
                        {
                            notification.text &&
                            <div className={`Notify-text ${notification.type}-text`}>
                                {notification.text}
                            </div>
                        }
                        {
                            notification.requirement &&
                            <div className={`Notify-text ${notification.type}`}>
                                {notification.requirement}
                            </div>
                        }
                        {
                            notification.image &&
                            <img className={`Notification-img ${notification.type}-img`}
                                 src={notification.image} alt={notification.image}/>
                        }
                        {
                            notification.link &&
                            <a className={`Notify-text ${notification.type}-text`} href={notification.link}>
                                <div className={`Notify-title ${notification.type}-title`}>
                                    {notification.title}
                                </div>
                            </a>
                        }

                        <div className={'material-icons Nofity-delete'}
                             onClick={() => deleteHandler(notification.id)}>delete_forever
                        </div>
                    </div>
                )
                : null}
        </>
    );
};
