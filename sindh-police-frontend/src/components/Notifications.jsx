import { useEffect, useState } from 'react';
import socket from '../utils/socket';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('receive_notification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_notification');
    };
  }, []);

  const sendNotification = () => {
    socket.emit('send_notification', {
      message: 'New alert from Sindh Police!',
      time: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div>
      <button onClick={sendNotification}>Send Notification</button>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message} - {notif.time}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;