import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Plus,
  Trash2,
  Save,
  FileText,
  Download,
  Search,
  Edit2,
  Code2, // Added for app title
} from "lucide-react";

export default function OnlineIDE() {
  const languageOptions = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "Ruby", value: "ruby" },
    { label: "Rust", value: "rust" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "PHP", value: "php" },
    { label: "C#", value: "csharp" },
  ];

  const makeId = (prefix = "f") =>
    `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

  const [files, setFiles] = useState(() => [
    {
      id: makeId("main"),
      name: "main.js",
      language: "javascript",
      code: "// Write your code here\nconsole.log('Hello World');",
      input: "", // <-- new field for stdin
      saved: true,
    },
  ]);

  const [currentFileId, setCurrentFileId] = useState(files[0].id);
  const [outputLogs, setOutputLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState("");
  const editorRef = useRef(null);

  const currentFile = files.find((f) => f.id === currentFileId) || files[0];

  function updateFile(fileId, patch) {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...patch } : f))
    );
  }

  function addFile(extension = "js") {
    const newNameBase = `untitled`;
    let index = 1;
    let nameCandidate = `${newNameBase}${index}.${extension}`;
    while (files.some((f) => f.name === nameCandidate)) {
      index += 1;
      nameCandidate = `${newNameBase}${index}.${extension}`;
    }

    const newFile = {
      id: makeId("u"),
      name: nameCandidate,
      language: extension === "js" ? "javascript" : extension,
      code: "",
      input: "",
      saved: false,
    };
    setFiles((p) => [newFile, ...p]);
    setCurrentFileId(newFile.id);
  }

  function removeFile(fileId) {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (!fileToRemove) return;
    const ok = window.confirm(`Delete '${fileToRemove.name}'?`);
    if (!ok) return;
    setFiles((p) => p.filter((f) => f.id !== fileId));
    if (currentFileId === fileId) setCurrentFileId(files[0]?.id || null);
  }

  function renameFile(fileId) {
    const f = files.find((x) => x.id === fileId);
    if (!f) return;
    const newName = window.prompt("Rename file", f.name);
    if (newName && newName.trim())
      updateFile(fileId, { name: newName.trim(), saved: false });
  }

  function changeLanguageForFile(fileId, language) {
    updateFile(fileId, { language, saved: false });
  }

  function handleEditorChange(value) {
    updateFile(currentFileId, { code: value || "", saved: false });
  }

  function handleInputChange(value) {
    updateFile(currentFileId, { input: value || "", saved: false });
  }

  function saveCurrentFile() {
    if (!currentFile) return;
    updateFile(currentFile.id, { saved: true });
    pushLog(`Saved ${currentFile.name}`);
  }

  function pushLog(line) {
    setOutputLogs((p) => [...p, `${new Date().toLocaleTimeString()}: ${line}`]);
  }

  function clearLogs() {
    setOutputLogs([]);
  }

  async function runCode() {
    if (!currentFile) return;
    setIsRunning(true);
    clearLogs();
    pushLog(`Running ${currentFile.name} (${currentFile.language})`);
    try {
      await new Promise((r) => setTimeout(r, 700));
      pushLog("--- Program output start ---");

      // Simulate using stdin
      if (currentFile.input?.trim()) {
        pushLog(`Input provided:\n${currentFile.input.trim()}`);
      }

      const code = currentFile.code || "";
      const consoleLogMatches = [...code.matchAll(/console\.log\(([^)]*)\)/g)];
      if (consoleLogMatches.length) {
        consoleLogMatches.slice(0, 10).forEach((m) => {
          let txt = m[1].trim().replace(/^['"`]|['"`]$/g, "");
          pushLog(txt || "(logged value)");
        });
      } else if (/print\(/.test(code)) {
        const pyMatches = [...code.matchAll(/print\(([^)]*)\)/g)];
        pyMatches.slice(0, 10).forEach((m) => {
          let txt = m[1].trim().replace(/^['"`]|['"`]$/g, "");
          pushLog(txt || "(printed value)");
        });
      } else {
        pushLog(
          "(simulated) Program executed successfully — no console-like output detected."
        );
      }

      pushLog("--- Program output end ---");
    } catch (err) {
      pushLog(`Error: ${err?.message || String(err)}`);
    }
    setIsRunning(false);
  }

  // keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+P to run
  useEffect(() => {
    const handler = (e) => {
      const modKey = e.ctrlKey || e.metaKey;
      if (modKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentFile();
      }
      if (modKey && e.key.toLowerCase() === "p") {
        if (!e.shiftKey) {
          e.preventDefault();
          runCode();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentFileId, files]);

  function downloadFile(file) {
    const blob = new Blob([file.code || ""], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    pushLog(`Downloaded ${file.name}`);
  }

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    // Use h-screen for full height and grid layout
    <div className="h-screen bg-gray-950 text-white p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar */}
      <aside className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex flex-col gap-3 overflow-hidden">
        {/* App Title */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
          <Code2 size={20} className="text-blue-400" />
          <h2 className="font-semibold text-lg">Web IDE</h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h3 className="font-semibold">Files</h3>
            <span className="text-xs text-gray-400 ml-2">({files.length})</span>
          </div>
          <button
            onClick={() => addFile("js")}
            title="New file"
            className="p-2 rounded-md bg-green-600 hover:bg-green-700"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Search size={16} />
          <input
            placeholder="Search files..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 flex-1 px-2 py-1 rounded-md text-sm"
          />
        </div>

        {/* File List - takes remaining space */}
        <div className="flex-1 overflow-auto">
          {filteredFiles.length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No files found</p>
          ) : (
            filteredFiles.map((f) => (
              <div
                key={f.id}
                className={`flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-800 ${
                  f.id === currentFileId ? "bg-gray-800" : ""
                }`}
              >
                <div onClick={() => setCurrentFileId(f.id)} className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {f.name}
                    </span>
                    {!f.saved && (
                      <span className="ml-1 text-xs text-yellow-400">•</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{f.language}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    title="Rename"
                    onClick={() => renameFile(f.id)}
                    className="p-1 rounded hover:bg-gray-800"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    title="Download"
                    onClick={() => downloadFile(f)}
                    className="p-1 rounded hover:bg-gray-800"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => removeFile(f.id)}
                    className="p-1 rounded hover:bg-red-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
          <button
            onClick={() => setFiles([])}
            className="text-sm text-gray-400 hover:text-white"
            title="Clear all files (unsaved will be lost)"
          >
            Clear all
          </button>
          <div className="flex-1" />
          <small className="text-xs text-gray-500">Tip: Ctrl/Cmd+S to save</small>
        </div>
      </aside>

      {/* Main area - flex col and overflow-hidden */}
      <main className="flex flex-col gap-3 overflow-hidden">
        {/* Header - shrinks */}
        <div className="flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            {files.map((f) => (
              <button
                key={f.id}
                onClick={() => setCurrentFileId(f.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  f.id === currentFileId ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                {f.name} {!f.saved && <span className="text-xs text-yellow-400">•</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentFile?.language || "javascript"}
              onChange={(e) =>
                changeLanguageForFile(currentFile.id, e.target.value)
              }
              className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 text-sm"
            >
              {languageOptions.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>

            <button
              onClick={saveCurrentFile}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
            >
              <Save size={14} /> Save
            </button>

            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
            >
              <Play size={16} /> {isRunning ? "Running..." : "Run"}
            </button>

            <button
              onClick={() => downloadFile(currentFile)}
              title="Download file"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Editor + Input + Output - takes remaining space */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Editor - flex col and overflow-hidden */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-2">
              {/* --- 1. TITLE CHANGED --- */}
              <h2 className="text-lg font-semibold">Editor</h2>
              <div className="text-sm text-gray-400">
                {currentFile?.name} ({currentFile?.language})
              </div>
            </div>

            {/* Editor container - takes remaining space */}
            <div className="flex-1 mt-2">
              {/* --- 3. EDITOR HEIGHT CHANGED --- */}
              <Editor
                height="100%"
                theme="vs-dark"
                language={
                  currentFile?.language === "cpp"
                    ? "cpp"
                    : currentFile?.language || "javascript"
                }
                value={currentFile?.code}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  wordWrap: "on",
                }}
                onMount={(editor) => (editorRef.current = editor)}
              />
            </div>
          </div>

          {/* Console & Input - flex col and overflow-hidden */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              {/* --- 2. MAIN HEADING CHANGED --- */}
              <h2 className="text-lg font-semibold">Console</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(outputLogs.join("\n"));
                    pushLog("Copied output to clipboard");
                  }}
                  className="px-2 py-1 rounded hover:bg-gray-800 text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={clearLogs}
                  className="px-2 py-1 rounded hover:bg-gray-800 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Input Panel - shrinks */}
            <div className="mt-2 flex-shrink-0">
              {/* --- 2. INPUT HEADING ADDED --- */}
              <h3 className="text-md font-semibold mb-1">Input (stdin)</h3>
              <textarea
                className="w-full bg-black text-white p-2 rounded-md resize-none text-sm border border-gray-800 font-mono"
                rows={4} // Use rows instead of fixed height
                value={currentFile?.input || ""}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter input here..."
              />
            </div>

            {/* Output Panel - takes remaining space */}
            <div className="mt-3 flex-1 overflow-auto">
              {/* --- 2. OUTPUT HEADING ADDED --- */}
              <h3 className="text-md font-semibold mb-1">Output</h3>
              <pre
                className="bg-black text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap text-sm font-mono
                           h-full" // --- 3. OUTPUT HEIGHT CHANGED ---
              >
                {outputLogs.length === 0
                  ? "(no output yet)"
                  : outputLogs.join("\n")}
              </pre>
            </div>

            <div className="mt-2 text-xs text-gray-400 flex-shrink-0">
              Tip: This IDE simulates execution for safety.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}