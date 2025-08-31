import React, { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default function Editor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    const startState = EditorState.create({
      doc: value || "",
      extensions: [
        basicSetup,
        javascript(),
        dracula, // ✅ THEME GOES HERE
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: document.getElementById("editor"),
    });

    editorRef.current = view;
  }, []);

  return <div id="editor" className="h-scrern w-full" />;
}
