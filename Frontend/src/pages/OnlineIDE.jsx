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
  Code2,
  X,
  Moon,
  Sun,
} from "lucide-react";

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

const defaultCodeSnippets = {
  javascript: "// Write your code here\nconsole.log('Hello World');",
  python: "# Write your code here\nprint('Hello World')",
  java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
  cpp: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\";\n    return 0;\n}",
};

export default function OnlineIDE() {
  const makeId = (prefix = "f") =>
    `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

  const [files, setFiles] = useState(() => [
    {
      id: makeId("main"),
      name: "main.js",
      language: "javascript",
      code: defaultCodeSnippets.javascript,
      input: "",
      output: "",
      saved: true,
    },
  ]);

  const [currentFileId, setCurrentFileId] = useState(files[0].id);
  const [filter, setFilter] = useState("");
  const [theme, setTheme] = useState("dark");
  const editorRef = useRef(null);
  const tabContainerRef = useRef(null);

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
      language: "javascript",
      code: defaultCodeSnippets.javascript,
      input: "",
      output: "",
      saved: false,
    };
    setFiles((p) => [...p, newFile]);
    setCurrentFileId(newFile.id);

    setTimeout(() => {
      tabContainerRef.current?.scrollTo({
        left: tabContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }, 100);
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
    updateFile(fileId, {
      language,
      code: defaultCodeSnippets[language] || "",
      saved: false,
    });
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
  }

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
  }

  useEffect(() => {
    const handler = (e) => {
      const modKey = e.ctrlKey || e.metaKey;
      if (modKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentFile();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentFileId, files]);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";
  const bgPanel = isDark ? "bg-gray-900" : "bg-white";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"} 
      p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 transition-colors duration-300`}
    >
      {/* Sidebar */}
      <aside
        className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-3 flex flex-col gap-3 transition-all duration-300`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-blue-500" />
            <h2 className="font-semibold text-lg">Web IDE</h2>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${hoverBg} transition`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h3 className={`uppercase text-xs font-semibold tracking-wider ${textMuted}`}>
              Files
            </h3>
          </div>
          <button
            onClick={() => addFile("js")}
            title="New file"
            className="p-2 rounded-md bg-green-600 hover:bg-green-700 active:scale-95 transition-transform"
          >
            <Plus size={16} />
          </button>
        </div>

        <div
          className={`flex items-center gap-2 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          } rounded-md px-2 py-1`}
        >
          <Search size={16} className={textMuted} />
          <input
            placeholder="Search files..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent flex-1 text-sm outline-none"
          />
        </div>

        <div className="flex-1 overflow-auto mt-1">
          {filteredFiles.length === 0 ? (
            <p className={`text-sm ${textMuted} mt-3`}>No files found</p>
          ) : (
            filteredFiles.map((f) => (
              <div
                key={f.id}
                className={`flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer ${hoverBg} transition-colors ${
                  f.id === currentFileId
                    ? isDark
                      ? "bg-gray-800"
                      : "bg-gray-200"
                    : ""
                }`}
              >
                <div onClick={() => setCurrentFileId(f.id)} className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {f.name}
                    </span>
                    {!f.saved && (
                      <span className="ml-1 text-xs text-yellow-500">•</span>
                    )}
                  </div>
                  <div className={`text-xs ${textMuted}`}>{f.language}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    title="Rename"
                    onClick={() => renameFile(f.id)}
                    className={`p-1 rounded ${hoverBg}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    title="Download"
                    onClick={() => downloadFile(f)}
                    className={`p-1 rounded ${hoverBg}`}
                  >
                    <Download size={14} />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => removeFile(f.id)}
                    className="p-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex flex-col gap-3 overflow-hidden">
        {/* Tabs + Actions */}
        <div
          className={`flex items-center justify-between gap-3 flex-shrink-0 border-b ${borderColor} pb-1`}
        >
          <div
            ref={tabContainerRef}
            className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
          >
            {files.map((f) => (
              <div
                key={f.id}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-all duration-150 ${
                  f.id === currentFileId
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-transparent hover:bg-gray-200/20"
                } rounded-t-md cursor-pointer flex-shrink-0`}
              >
                <button
                  onClick={() => setCurrentFileId(f.id)}
                  className="flex items-center gap-2"
                >
                  <span>{f.name}</span>
                  {!f.saved && (
                    <span className="text-xs text-yellow-500">•</span>
                  )}
                </button>
                {files.length > 1 && (
                  <button
                    onClick={() => removeFile(f.id)}
                    title="Close file"
                    className="hover:text-red-400 text-gray-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={currentFile?.language || "javascript"}
              onChange={(e) =>
                changeLanguageForFile(currentFile.id, e.target.value)
              }
              className={`${bgPanel} ${borderColor} border font-medium px-3 py-2 rounded-lg text-sm`}
            >
              {languageOptions.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>

            <button
              onClick={saveCurrentFile}
              className={`${bgPanel} ${borderColor} border flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-95 active:scale-90 transition`}
            >
              <Save size={14} /> Save
            </button>

            <button
              title="Run (handled by backend)"
              className={`${bgPanel} ${borderColor} border flex items-center gap-2 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed`}
              disabled
            >
              <Play size={16} /> Run
            </button>

            <button
              onClick={() => downloadFile(currentFile)}
              title="Download file"
              className={`${bgPanel} ${borderColor} border flex items-center justify-center px-3 h-[40px] rounded-lg hover:scale-95 transition`}
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Editor + Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Editor Section */}
          <div
            className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-4 flex flex-col overflow-hidden transition-all duration-300`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Editor</h2>
              <div className={`text-sm ${textMuted}`}>
                {currentFile?.name} ({currentFile?.language})
              </div>
            </div>

            <div className="flex-1 mt-2">
              <Editor
                height="100%"
                theme={isDark ? "vs-dark" : "light"}
                language={currentFile?.language || "javascript"}
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
            {/* Console Section */}
            <div
              className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-4 flex flex-col overflow-hidden transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Console</h2>
                <div className="flex gap-3 text-sm text-blue-400">
                  <button
                    className="hover:underline"
                    onClick={() =>
                      navigator.clipboard.writeText(currentFile.input || "")
                    }
                  >
                    Copy
                  </button>
                  <button
                    className="hover:underline"
                    onClick={() =>
                      updateFile(currentFile.id, { input: "", output: "" })
                    }
                  >
                    Clear
                  </button>
                </div>
              </div>
                
              {/* Input & Output Container */}
              <div className="flex flex-col gap-4 flex-1 min-h-[400px]">
                {/* Input Box (40%) */}
                <div className="flex flex-col h-[40%]">
                  <h3 className="text-sm font-semibold mb-1">Input</h3>
                  <textarea
                    placeholder="Enter input here..."
                    value={currentFile?.input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm outline-none resize-none
                      ${
                        isDark
                          ? "bg-black text-gray-300 border border-gray-700 placeholder-gray-600"
                          : "bg-gray-50 text-gray-800 border border-gray-300 placeholder-gray-400"
                      }`}
                  />
                </div>
                  
                {/* Output Box (60%) */}
                <div className="flex flex-col h-[60%]">
                  <h3 className="text-sm font-semibold mb-1">Output</h3>
                  <div
                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm overflow-auto
                      ${
                        isDark
                          ? "bg-black text-green-400 border border-gray-700"
                          : "bg-gray-50 text-green-700 border border-gray-300"
                      }`}
                  >
                    {currentFile.output
                      ? currentFile.output
                      : "(no output yet)"}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
