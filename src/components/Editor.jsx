import { useEffect } from "react";
import { Controlled as ControlledEditor } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import ACTIONS from "../../Action";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const handleChange = (value) => {
    onCodeChange(value);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          onCodeChange(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <ControlledEditor
      value=""
      height="100vh"
      extensions={[javascript()]}
      theme="dark"
      onChange={(value) => handleChange(value)}
      basicSetup={{
        lineNumbers: true,
        autocompletion: true,
        closeBrackets: true,
      }}
    />
  );
};

export default Editor;
