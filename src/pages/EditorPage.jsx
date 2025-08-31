import { useEffect, useRef, useState } from "react";
import logo from "/logo.png";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket, disconnectSocket } from "../socket";
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
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [code, setCode] = useState(""); // editor content

  useEffect(() => {
    if (!location.state) return;

    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      function handleErrors(err) {
        console.log("Socket connection failed due to", err);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      // Join room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state.username,
      });

      // Someone joins
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        setClients(clients);
        if (username !== location.state.username) {
          toast.success(`${username} joined the room.`);
        }
      });

      // Someone leaves
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        setClients((prev) => prev.filter((c) => c.socketId !== socketId));
        toast.error(`${username} left the room.`);
      });

      // Receive initial code or updates
      socketRef.current.on(ACTIONS.SYNC_CODE, ({ code: serverCode }) => {
        setCode((prev) => (prev === "" ? serverCode : prev)); // only if empty
      });

      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code: newCode }) => {
        setCode(newCode);
      });
    };

    init();

    return () => {
      disconnectSocket();
    };
  }, [location.state, navigate, roomId]);

  if (!location.state) return <Navigate to="/" />;

  return (
    <div className="main-wrapper">
      <div className="aside">
        <div className="aside-up">
          <div className="logo logo-wrapper" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
            <h1>CodeHub</h1>
          </div>
          <h3>Connected Users</h3>
          <div className="client-list">
            {clients.map((c) => (
              <Client key={c.socketId} username={c.username} />
            ))}
          </div>
        </div>
        <div className="aside-down">
          <button
            className="btn copy-btn"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(roomId);
                toast.success("Room ID copied to clipboard!");
              } catch (err) {
                toast.error("Failed to copy Room ID.");
                console.log(err);
              }
            }}
          >
            Copy ROOM ID
          </button>

          <button className="btn leave-btn" onClick={() => navigate("/")}>
            Leave Room
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          value={code}
          onCodeChange={setCode}
        />
      </div>
    </div>
  );
};

export default EditorPage;
