import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Plus, Trash2, Save, FileText, Download, Search, Edit2 } from "lucide-react";

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

  // helper to make a simple unique id
  const makeId = (prefix = "f") => `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

  const [files, setFiles] = useState(() => [
    {
      id: makeId("main"),
      name: "main.js",
      language: "javascript",
      code: "// Write your code here\nconsole.log('Hello World');",
      saved: true,
    },
  ]);

  const [currentFileId, setCurrentFileId] = useState(files[0].id);
  const [outputLogs, setOutputLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState("");
  const editorRef = useRef(null);

  const currentFile = files.find((f) => f.id === currentFileId) || files[0];

  // update editor value when current file changes
  useEffect(() => {
    // nothing special here — Editor controlled via value prop
  }, [currentFileId]);

  function updateFile(fileId, patch) {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...patch } : f)));
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
    if (newName && newName.trim()) updateFile(fileId, { name: newName.trim(), saved: false });
  }

  function changeLanguageForFile(fileId, language) {
    updateFile(fileId, { language, saved: false });
  }

  function handleEditorChange(value) {
    updateFile(currentFileId, { code: value || "", saved: false });
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
      // simulated execution delay
      await new Promise((r) => setTimeout(r, 700));

      // simple simulated outputs to keep UI snappy and safe
      pushLog("--- Program output start ---");

      // Make a tiny heuristic: if the code contains `console.log('...')` or `print(` show that string
      const code = currentFile.code || "";
      const consoleLogMatches = [...code.matchAll(/console\.log\(([^)]*)\)/g)];
      if (consoleLogMatches.length) {
        consoleLogMatches.slice(0, 10).forEach((m) => {
          // crude clean: remove surrounding quotes if present
          let txt = m[1].trim();
          try {
            // try to eval the literal expression safely for strings/numbers/objects
            // only allow simple literal values — block if contains new Function etc.
            if (/^[`'"]/.test(txt) && /[`'"\]]$/.test(txt)) {
              // remove wrappers
              txt = txt.replace(/^`|`$|^'|'$|^"|"$/g, "");
            }
          } catch (e) {
            // ignore
          }
          pushLog(txt || "(logged value)");
        });
      } else if (/print\(/.test(code)) {
        // python style
        const pyMatches = [...code.matchAll(/print\(([^)]*)\)/g)];
        pyMatches.slice(0, 10).forEach((m) => {
          let txt = m[1].trim().replace(/^['\"]|['\"]$/g, "");
          pushLog(txt || "(printed value)");
        });
      } else {
        pushLog(`(simulated) Program executed successfully — no console-like output detected.`);
      }

      pushLog("--- Program output end ---");
    } catch (err) {
      pushLog(`Error: ${err?.message || String(err)}`);
    }

    setIsRunning(false);
  }

  // keyboard shortcuts: Ctrl/Cmd+S to save
  useEffect(() => {
    const handler = (e) => {
      const modKey = e.ctrlKey || e.metaKey;
      if (modKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentFile();
      }
      if (modKey && e.key.toLowerCase() === "p") {
        // Ctrl/Cmd+P quick run
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
    const blob = new Blob([file.code || ""], { type: "text/plain;charset=utf-8" });
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

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar */}
      <aside className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h3 className="font-semibold">Files</h3>
            <span className="text-xs text-gray-400 ml-2">({files.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addFile("js")}
              title="New file"
              className="p-2 rounded-md bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} />
            </button>
          </div>
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
                    <span className="text-sm font-medium truncate">{f.name}</span>
                    {!f.saved && <span className="ml-1 text-xs text-yellow-400">•</span>}
                  </div>
                  <div className="text-xs text-gray-400">{f.language}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button title="Rename" onClick={() => renameFile(f.id)} className="p-1 rounded hover:bg-gray-800">
                    <Edit2 size={14} />
                  </button>
                  <button title="Download" onClick={() => downloadFile(f)} className="p-1 rounded hover:bg-gray-800">
                    <Download size={14} />
                  </button>
                  <button title="Delete" onClick={() => removeFile(f.id)} className="p-1 rounded hover:bg-red-800">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main area */}
      <main className="flex flex-col gap-3">
        {/* Header with tabs and actions */}
        <div className="flex items-center justify-between gap-3">
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
              onChange={(e) => changeLanguageForFile(currentFile.id, e.target.value)}
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
              title="Save (Ctrl/Cmd+S)"
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

        {/* Editor + Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 flex flex-col">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-semibold">Editor — {currentFile?.name}</h2>
              <div className="text-sm text-gray-400">{currentFile?.language}</div>
            </div>

            <div className="flex-1 mt-2">
              <Editor
                height="64vh"
                theme="vs-dark"
                language={currentFile?.language === "cpp" ? "cpp" : currentFile?.language || "javascript"}
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

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Console Output</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => {navigator.clipboard?.writeText(outputLogs.join('\n')); pushLog('Copied output to clipboard');}} className="px-2 py-1 rounded hover:bg-gray-800">Copy</button>
                <button onClick={clearLogs} className="px-2 py-1 rounded hover:bg-gray-800">Clear</button>
                <button onClick={() => downloadFile({ name: (currentFile?.name || 'output.txt') + '.log', code: outputLogs.join('\n') })} className="px-2 py-1 rounded hover:bg-gray-800">Save Log</button>
              </div>
            </div>

            <div className="flex-1 mt-2 overflow-auto">
              <pre className="bg-black text-green-400 p-4 rounded-lg h-[64vh] overflow-auto whitespace-pre-wrap text-sm">
                {outputLogs.length === 0 ? "(no output yet)" : outputLogs.join("\n")}
              </pre>
            </div>

            <div className="mt-2 text-xs text-gray-400">Tip: This IDE simulates execution for safety. Use Save + Download to persist files.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
