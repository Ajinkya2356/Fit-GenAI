import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";


const Notification = (message, category) => {
  Store.addNotification({
    title: message,
    type: category,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export default Notification;
