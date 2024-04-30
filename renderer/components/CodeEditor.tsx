import React from "react";

import Editor from "@monaco-editor/react";

export default function CodeEditor(props) {
  const handleEditorWillMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const tableSuggestions = props.tables.map((table) => ({
          label: table,
          insertText: table,
          kind: monaco.languages.CompletionItemKind.Folder,
          detail: "Table",
          range: range,
        }));

        return {
          suggestions: [
            {
              label: "SELECT",
              insertText: "SELECT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              detail: "Keyword",
              range: range,
            },
            {
              label: "FROM",
              insertText: "FROM",
              kind: monaco.languages.CompletionItemKind.Keyword,
              detail: "Keyword",
              range: range,
            },
            {
              label: "GROUP BY",
              insertText: "GROUP BY",
              kind: monaco.languages.CompletionItemKind.Keyword,
              detail: "Keyword",
              range: range,
            },
            ...tableSuggestions,
          ],
        };
      },
    });
  };

  return (
    <Editor
      onMount={handleEditorWillMount}
      highlightActiveLine
      showGutter
      theme={"vs-dark"}
      showPrintMargin
      editorProps={{ $blockScrolling: true }}
      wrapEnabled={true}
      options={{
        fontSize: 14,
        minimap: {
          enabled: false,
        },
      }}
      style={{
        width: "100%",
        flex: 1,
        ...(props?.extraStyles || {}),
      }}
      language="sql"
      {...props}
    />
  );
}
