import { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/darcula.css";
import "codemirror/addon/edit/closeBrackets";
import "codemirror/addon/edit/closeTag";
import ACTIONS from "../../Action";

const Editor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      if (editorRef.current) return;

      const editor = Codemirror.fromTextArea(
        document.getElementById("realtime-editor"),
        {
          mode: { name: "javascript", json: true },
          theme: "darcula",
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
        }
      );

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = editor.getValue();
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
      });

      editorRef.current = editor; // store editor instance
    }

    init();

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtime-editor"></textarea>;
};

export default Editor;
