import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { initSocket } from "./socket";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    initSocket().then((socketInstance) => {
      console.log("Socket connected on client:", socketInstance.id);
      setSocket(socketInstance);
    });
    // Optional: clean up on unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{
            success: {
              style: {
                padding: "8px",
                color: "var(--dark-one)",
                fontSize: "13px",
                fontFamily: "var(--font-style)",
                fontWeight: "600",
              },
              iconTheme: {
                primary: "#4aed88",
                secondary: "var(--light-one)",
              },
            },
            error: {
              style: {
                padding: "8px",
                color: "var(--dark-one)",
                fontSize: "13px",
                fontFamily: "var(--font-style)",
                fontWeight: "600",
              },
              iconTheme: {
                primary: "#f87171",
                secondary: "var(--light-one)",
              },
            },
          }}
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/editor/:roomId" element={<EditorPage socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
