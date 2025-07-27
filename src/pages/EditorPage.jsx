import { useEffect, useRef, useState } from "react";
import logo from "/logo.png";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Action";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handelErrors(err));
      socketRef.current.on("connect_failed", (err) => handelErrors(err));

      function handelErrors(err) {
        console.log("Socket connection failed due to", err);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/"); // Redirect to home page
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username, // ? it is for to check if username is passed from previous page
      });

      // Listen for the 'joined' event to update clients
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} has joined the room.`);
          }
          // Update the client list
          setClients(clients);
        }
      );
    };
    init();
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="main-wrapper">
        <div className="aside">
          <div className="aside-up">
            <div className="logo logo-wrapper">
              <img src={logo} alt="code-hub-logo" />
              <div className="logo-name">
                <h1>Code Hub</h1>
              </div>
            </div>
            <h3>Connected Users</h3>
            <div className="client-list">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <div className="aside-down">
            <button className="btn copy-btn">Copy ROOM ID</button>
            <button className="btn leave-btn">Leave Room</button>
          </div>
        </div>
        <div className="editor-wrapper">
          <Editor />
        </div>
      </div>
    </>
  );
};

export default EditorPage;
