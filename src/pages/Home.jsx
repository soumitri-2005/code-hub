import logo from "/logo.png";
const Home = () => {
  return (
    <>
      <div className="home-page-wrapper">
        <div className="form-wrapper">
          <div className="logo">
            <img src={logo} alt="code-hub-logo" />
            <div className="line"></div>
            <div className="logo-name">
              <h1>Code Hub</h1>
              <p>Collaborative Code Editor</p>
            </div>
          </div>
          <h4 className="main-label">Paste invitation ROOM ID :</h4>
          <div className="input-group">
            <input type="text" className="input-box" placeholder="ROOM ID" />
            <input type="text" className="input-box" placeholder="USERNAME" />
            <button className="btn join-btn">Join</button>
            <span className="create-info">
              if you don't have an invite then create a new room &nbsp;
              <a href="" className="create-new-btn">
                new room
              </a>
            </span>
          </div>
        </div>
        <footer>
          <p>
            Created by <a href="https://github.com/soumitri-2005">Soumitri Mishra</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
