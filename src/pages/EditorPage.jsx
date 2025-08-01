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
  const codeRef = useRef(null);
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

      // listening for connected
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} has joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

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

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard.");
    } catch (error) {
      toast.error("Could not copy the room ID.");
      console.log(error);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  function homePage() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="main-wrapper">
      <div className="aside">
        <div className="aside-up">
          <div className="logo logo-wrapper" onClick={homePage}>
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
          <button className="btn copy-btn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leave-btn" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
