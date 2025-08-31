import { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import ACTIONS from "../../Action";

const Editor = ({ socketRef, roomId, value, onCodeChange }) => {
  const handleChange = (val) => {
    onCodeChange(val);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: val });
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    const handleRemote = ({ code }) => {
      if (code !== value) {
        onCodeChange(code);
      }
    };

    socketRef.current.on(ACTIONS.CODE_CHANGE, handleRemote);
    socketRef.current.on(ACTIONS.SYNC_CODE, handleRemote);

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE, handleRemote);
      socketRef.current.off(ACTIONS.SYNC_CODE, handleRemote);
    };
  }, [socketRef.current, value, onCodeChange]);

  return (
    <CodeMirror
      value={value}
      height="calc(100vh - 20px)"
      theme="dark"
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
};

export default Editor;
