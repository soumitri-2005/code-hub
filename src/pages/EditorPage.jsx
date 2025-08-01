import { useEffect, useRef, useState } from "react";
import logo from "/logo.png";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket, disconnectSocket } from "../socket"; // <-- updated
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
      socketRef.current.on("connect_error", handelErrors);
      socketRef.current.on("connect_failed", handelErrors);

      function handelErrors(err) {
        console.log("Socket connection failed due to", err);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} has joined the room.`);
        }
        setClients(clients);
      });

      // listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.error(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    // Cleanup when component unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
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
        <Editor socketRef={socketRef} roomId={roomId}/>
      </div>
    </div>
  );
};

export default EditorPage;
