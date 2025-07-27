import { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/darcula.css";
import "codemirror/addon/edit/closeBrackets";
import "codemirror/addon/edit/closeTag";

const Editor = () => {
  useEffect(() => {
    async function init() {
      Codemirror.fromTextArea(document.getElementById("realtime-editor"), {
        mode: { name: "javascript", json: true },
        theme: "darcula",
        autoCloseBrackets: true,
        autoCloseTags: true,  
        lineNumbers: true,
      });
    }
    init();
  }, []);

  return <textarea id="realtime-editor"></textarea>;
};

export default Editor;
