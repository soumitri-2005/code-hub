import { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import ACTIONS from "../../Action";

const Editor = ({ socketRef, roomId, onCodeChange, value = "" }) => {
  const handleChange = (val) => {
    onCodeChange(val);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: val });
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
  }, [socketRef]);

  return (
    <CodeMirror
      value={value}
      height="100vh"
      theme="dark"
      extensions={[javascript()]}
      onChange={(val) => handleChange(val)}
    />
  );
};

export default Editor;
