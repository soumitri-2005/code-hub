import { useState } from "react";
import logo from "/logo.png";
import Client from "../components/Client";
import Editor from "../components/Editor";

const EditorPage = () => {
  const [clients, setClients] = useState([
    {
      socketId: 1,
      username: "User1",
    },
    {
      socketId: 2,
      username: "User2",
    },
    {
      socketId: 3, 
      username: "User3",
    },
    {
      socketId: 4,
      username: "User4",
    },
    {
      socketId: 5,
      username: "User5",
    },
    {
      socketId: 6,
      username: "User6",
    },
  ]);

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
