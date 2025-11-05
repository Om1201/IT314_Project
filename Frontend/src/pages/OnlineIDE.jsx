import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";

export default function OnlineIDE() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello World');");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running your code...\n");

    try {
      await new Promise((r) => setTimeout(r, 1500));
      setOutput(` Output:\nHello from ${language}!`);
    } catch (err) {
      setOutput(` Error: ${err.message}`);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col gap-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Online IDE</h1>
        <div className="flex items-center gap-3">
          <select
            className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            <Play size={16} /> {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Editor Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-2">
          <h2 className="text-lg font-semibold mb-2">Editor</h2>
          <Editor
            height="70vh"
            theme="vs-dark"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-2">
          <h2 className="text-lg font-semibold mb-2">Console Output</h2>
          <pre className="bg-black text-green-400 p-4 rounded-lg h-[70vh] overflow-auto whitespace-pre-wrap text-sm">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
