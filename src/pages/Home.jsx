import { useState } from "react";
import logo from "/logo.png";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid(); // here new id will be generated
    setRoomId(id); // store the id in state
    toast.success("New room created successfully!");
  };

  return (
    <>
      <div className="home-page-wrapper">
        <div className="form-wrapper">
          <div className="logo">
            <img src={logo} alt="code-hub-logo" />
            <div className="logo-name">
              <h1>Code Hub</h1>
            </div>
          </div>
          <h4 className="main-label">Paste invitation ROOM ID :</h4>
          <div className="input-group">
            <input
              type="text"
              className="input-box"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
            <input
              type="text"
              className="input-box"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <button className="btn join-btn">Join</button>
            <span className="create-info">
              if you don't have an invite then create a
              <a onClick={createNewRoom} href="" className="create-new-btn">
                &nbsp;new room
              </a>
            </span>
          </div>
        </div>
        <footer>
          <p>
            Created by{" "}
            <a href="https://github.com/soumitri-2005">Soumitri Mishra</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
