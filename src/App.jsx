import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
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
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
