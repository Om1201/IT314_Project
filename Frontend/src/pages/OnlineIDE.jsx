import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'motion/react';
import NoteModal from '../components/NoteModal.jsx';
import GridBackground from '../components/ui/GridBackground.jsx';
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
    Copy,
    Eraser,
    FilePlus,
    Maximize2,
    Minimize2,
    Rows,
    Columns,
} from 'lucide-react';

const languageOptions = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C', value: 'c' },
    { label: 'C++', value: 'cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'PHP', value: 'php' },
    { label: 'Swift', value: 'swift' },
    { label: 'Kotlin', value: 'kotlin' },
    { label: 'R', value: 'r' },
    { label: 'Scala', value: 'scala' },
    { label: 'Perl', value: 'perl' },
    { label: 'Haskell', value: 'haskell' },
    { label: 'Lua', value: 'lua' },
    { label: 'Dart', value: 'dart' },
    { label: 'Bash', value: 'bash' },
];

const defaultCodeSnippets = {
    javascript: `// Write your code here
console.log("Hello World");`,

    typescript: `// Write your code here
const msg: string = "Hello World";
console.log(msg);`,

    python: `# Write your code here
print("Hello World")`,

    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

    c: `#include <stdio.h>
int main() {
    printf("Hello World");
    return 0;
}`,

    cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello World";
    return 0;
}`,

    csharp: `using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`,

    go: `package main
import "fmt"
func main() {
    fmt.Println("Hello World")
}`,

    rust: `fn main() {
    println!("Hello World");
}`,

    ruby: `puts "Hello World"`,

    php: `<?php
echo "Hello World";
?>`,

    swift: `import Foundation
print("Hello World")`,

    kotlin: `fun main() {
    println("Hello World")
}`,

    r: `print("Hello World")`,

    scala: `object Main extends App {
  println("Hello World")
}`,

    perl: `print "Hello World\\n";`,

    haskell: `main = putStrLn "Hello World"`,

    lua: `print("Hello World")`,

    dart: `void main() {
  print("Hello World");
}`,

    bash: `echo "Hello World"`,
};


export default function OnlineIDE() {
    const makeId = (prefix = 'f') =>
        `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;

    const [files, setFiles] = useState(() => [
        {
            id: makeId('main'),
            name: 'main.js',
            language: 'javascript',
            code: defaultCodeSnippets.javascript,
            input: '',
            output: '',
            saved: true,
        },
    ]);

    const [currentFileId, setCurrentFileId] = useState(files[0].id);
    const [filter, setFilter] = useState('');
    const [theme, setTheme] = useState('dark');
    const editorRef = useRef(null);
    const tabContainerRef = useRef(null);

    const currentFile = files.find(f => f.id === currentFileId) || files[0];

    const [isRunning, setIsRunning] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
    const [layoutMode, setLayoutMode] = useState('side'); // 'side' | 'bottom'

    function updateFile(fileId, patch) {
        setFiles(prev => prev.map(f => (f.id === fileId ? { ...f, ...patch } : f)));
    }

    function addFile(extension = 'js') {
        const newNameBase = `untitled`;
        let index = 1;
        let nameCandidate = `${newNameBase}${index}.${extension}`;
        while (files.some(f => f.name === nameCandidate)) {
            index += 1;
            nameCandidate = `${newNameBase}${index}.${extension}`;
        }

        const newFile = {
            id: makeId('u'),
            name: nameCandidate,
            language: 'javascript',
            code: defaultCodeSnippets.javascript,
            input: '',
            output: '',
            saved: false,
        };
        setFiles(p => [...p, newFile]);
        setCurrentFileId(newFile.id);

        setTimeout(() => {
            tabContainerRef.current?.scrollTo({
                left: tabContainerRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }, 100);
    }

    function removeFile(fileId) {
        const fileToRemove = files.find(f => f.id === fileId);
        if (!fileToRemove) return;
        const ok = window.confirm(`Delete '${fileToRemove.name}'?`);
        if (!ok) return;
        setFiles(p => p.filter(f => f.id !== fileId));
        if (currentFileId === fileId) setCurrentFileId(files[0]?.id || null);
    }

    function renameFile(fileId) {
        const f = files.find(x => x.id === fileId);
        if (!f) return;
        const newName = window.prompt('Rename file', f.name);
        if (newName && newName.trim()) updateFile(fileId, { name: newName.trim(), saved: false });
    }

    function changeLanguageForFile(fileId, language) {
        updateFile(fileId, {
            language,
            code: defaultCodeSnippets[language] || '',
            saved: false,
        });
    }

    function handleEditorChange(value) {
        updateFile(currentFileId, { code: value || '', saved: false });
    }

    function handleInputChange(value) {
        updateFile(currentFileId, { input: value || '', saved: false });
    }

    function saveCurrentFile() {
        if (!currentFile) return;
        updateFile(currentFile.id, { saved: true });
    }

    function downloadFile(file) {
        const blob = new Blob([file.code || ''], {
            type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    async function runCode() {
      

      if (!currentFile || !currentFile.code.trim()) {
        alert("No code to run!");
        return;
      }
    
      setIsRunning(true);
      updateFile(currentFile.id, { output: "Running..." });
    
      try {
        const response = await fetch("http://localhost:4000/api/code/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",            
          },
          credentials: "include",
          body: JSON.stringify({
            language: currentFile.language,
            version: "latest", 
            files: [
              {
                name:
                  currentFile.name ||
                  `main.${currentFile.language === "python"
                    ? "py"
                    : currentFile.language === "javascript"
                    ? "js"
                    : currentFile.language === "java"
                    ? "java"
                    : "cpp"}`,
                content: currentFile.code,
              },
            ],
            args: [],
            stdin: currentFile.input || "",
          }),
        });
      
        const data = await response.json();
      
        if (!data.success) {
          updateFile(currentFile.id, { output: `Error: ${data.message}` });
        } else {
          // Piston returns output inside data.data.run.output
          const pistonResult = data.data?.run || {};
          const finalOutput =
            pistonResult.output ||
            pistonResult.stderr ||
            "(no output)";
          updateFile(currentFile.id, { output: finalOutput });
        }
      } catch (err) {
        updateFile(currentFile.id, { output: "Execution failed: " + err.message });
      } finally {
        setIsRunning(false);
      }
    }


    useEffect(() => {
        const handler = e => {
            const modKey = e.ctrlKey || e.metaKey;
            if (modKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                saveCurrentFile();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [currentFileId, files]);

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const isDark = theme === 'dark';
    // Themed palette leaning into black/blue/green coder aesthetic
    const bgPanel = isDark ? 'bg-black/50 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    // Lighten only the sidebar and console panels to avoid overall heavy black feel
    const bgSidebar = isDark ? 'bg-zinc-900/30 backdrop-blur-sm' : 'bg-black/5 backdrop-blur-sm';
    const bgConsole = isDark ? 'bg-zinc-900/30 backdrop-blur-sm' : 'bg-black/5 backdrop-blur-sm';
    const borderColor = isDark ? 'border-white/10' : 'border-black/10';
    const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-600';
    const hoverBg = isDark ? 'hover:bg-white/5' : 'hover:bg-black/5';

    return (
        <div className={`relative min-h-screen ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
            {/* Grid background replacement using shared UI component */}
            <GridBackground className="absolute inset-0 -z-10 dark:bg-black bg-black" containerClassName="hidden" />

            {/* Page content grid (full height) */}
            <div className={`relative z-10 p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 min-h-screen`}>
            {/* Sidebar */}
            <motion.aside
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`${bgSidebar} ${borderColor} border rounded-xl shadow-[0_10px_40px_-20px_rgba(14,165,233,0.25)] p-3 flex flex-col gap-3 transition-all duration-300 h-[calc(100vh-2rem)] min-h-0`}
            >
                <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Code2 size={20} className="text-sky-400" />
                        <h2 className="font-semibold text-lg tracking-tight">Web IDE</h2>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-md ${hoverBg} transition glow-blue cursor-pointer`}
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText size={18} />
                        <h3
                            className={`uppercase text-xs font-semibold tracking-wider ${textMuted}`}
                        >
                            Files
                        </h3>
                    </div>
                    <button
                        onClick={() => addFile('js')}
                        title="New file"
                        className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-transform text-white glow-green cursor-pointer"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div
                    className={`flex items-center gap-2 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-md px-2 py-1 border ${borderColor}`}
                >
                    <Search size={16} className={textMuted} />
                    <input
                        placeholder="Search files..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="bg-transparent flex-1 text-sm outline-none"
                    />
                </div>

                <div className="flex-1 overflow-auto mt-1">
                    {filteredFiles.length === 0 ? (
                        <p className={`text-sm ${textMuted} mt-3`}>No files found</p>
                    ) : (
                        filteredFiles.map(f => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className={`flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer ${hoverBg} transition-colors ${
                                    f.id === currentFileId ? 'bg-sky-400/10 border border-sky-400/20' : 'border border-transparent'
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
                                        className={`p-1 rounded ${hoverBg} cursor-pointer`}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        title="Download"
                                        onClick={() => downloadFile(f)}
                                        className={`p-1 rounded ${hoverBg} cursor-pointer`}
                                    >
                                        <Download size={14} />
                                    </button>
                                    <button
                                        title="Delete"
                                        onClick={() => removeFile(f.id)}
                                        className="p-1 rounded hover:bg-red-700 cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.aside>

            {/* Main Part */}
            <motion.main className="flex flex-col gap-3 overflow-hidden h-[calc(100vh-2rem)] min-h-0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                {/* Tabs  */}
                <div className={`flex items-center justify-between gap-3 shrink-0 border-b ${borderColor} pb-1`}>
                    <div
                        ref={tabContainerRef}
                        className="flex items-center gap-1 overflow-x-auto hide-scrollbar scroll-smooth flex-1"
                    >
                        {files.map(f => (
                            <div
                                key={f.id}
                                className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-all duration-150 ${
                                    f.id === currentFileId
                                        ? 'border-sky-400 bg-sky-400/10'
                                        : 'border-transparent hover:bg-white/5'
                                } rounded-t-md cursor-pointer shrink-0`}
                            >
                                <button
                                    onClick={() => setCurrentFileId(f.id)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <span>{f.name}</span>
                                    {!f.saved && <span className="text-xs text-yellow-500">•</span>}
                                </button>
                                {files.length > 1 && (
                                    <button
                                        onClick={() => removeFile(f.id)}
                                        title="Close file"
                                        className="hover:text-red-400 text-zinc-400 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={currentFile?.language || 'javascript'}
                            onChange={e => changeLanguageForFile(currentFile.id, e.target.value)}
                            className={`${bgPanel} ${borderColor} border font-medium px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40`}
                        >
                            {languageOptions.map(l => (
                                <option key={l.value} value={l.value}>
                                    {l.label}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={saveCurrentFile}
                            className={`${bgPanel} ${borderColor} border flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-95 active:scale-90 transition glow-blue cursor-pointer`}
                        >
                            <Save size={14} /> Save
                        </button>

                        <button
                          onClick={runCode}
                          title="Run code"
                          disabled={isRunning}
                                                    className={`relative overflow-hidden border ${borderColor} flex items-center gap-2 px-4 py-2 rounded-lg text-white
                            ${isRunning ? 'opacity-80 cursor-wait running-pulse' : 'hover:scale-95 transition transform glow-green'}
                                                        bg-linear-to-r from-emerald-600 to-sky-600`}
                        >
                          <Play size={16} />
                          {isRunning ? "Running..." : "Run"}
                          <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-20 transition-opacity bg-[radial-gradient(600px_200px_at_var(--x,50%)_0%,white,transparent_40%)]" />
                        </button>

                        <button
                            onClick={() => downloadFile(currentFile)}
                            title="Download file"
                            className={`${bgPanel} ${borderColor} border flex items-center justify-center px-3 h-10 rounded-lg hover:scale-95 transition glow-blue cursor-pointer`}
                        >
                            <Download size={14} />
                        </button>

                        <button
                            onClick={() => setLayoutMode(prev => (prev === 'side' ? 'bottom' : 'side'))}
                            title={layoutMode === 'side' ? 'Move console to bottom' : 'Place console to the right'}
                            className={`${bgPanel} ${borderColor} border flex items-center justify-center px-3 h-10 rounded-lg hover:scale-95 transition cursor-pointer`}
                        >
                            {layoutMode === 'side' ? <Columns size={14} /> : <Rows size={14} />}
                        </button>
                    </div>
                </div>

                {/* Editor and Console */}
                <div className={`grid ${layoutMode === 'side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4 flex-1 overflow-hidden min-h-0`}>
                    {/* Editor Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className={`${bgPanel} ${borderColor} border rounded-xl shadow-[0_12px_50px_-22px_rgba(34,197,94,0.25)] p-4 flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${layoutMode === 'bottom' ? 'h-[60vh]' : ''}`}
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                            <h2 className="text-lg font-semibold">Editor</h2>
                            <div className="flex items-center gap-2">
                                {/* File meta */}
                                <div className={`hidden sm:block text-sm ${textMuted}`}>
                                    {currentFile?.name} ({currentFile?.language})
                                </div>
                                {/* Editor actions: Copy/Clear code */}
                                <button
                                    title="Copy code"
                                    aria-label="Copy code"
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                    onClick={() => navigator.clipboard.writeText(currentFile.code || '')}
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    title="Clear code"
                                    aria-label="Clear code"
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                    onClick={() => updateFile(currentFile.id, { code: '', saved: false })}
                                >
                                    <Eraser size={16} />
                                </button>
                                <button
                                    title="Add note"
                                    aria-label="Add note"
                                    className={`p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer glow-green`}
                                    onClick={() => setShowNote(true)}
                                >
                                    <FilePlus size={16} />
                                </button>
                                {/* Fullscreen toggle */}
                                <button
                                    title={isEditorFullscreen ? 'Exit full screen' : 'Full screen editor'}
                                    onClick={() => setIsEditorFullscreen(v => !v)}
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                >
                                    {isEditorFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 mt-2">
                            <Editor
                                height="100%"
                                theme={isDark ? 'vs-dark' : 'light'}
                                language={currentFile?.language || 'javascript'}
                                value={currentFile?.code}
                                onChange={handleEditorChange}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                }}
                                onMount={editor => (editorRef.current = editor)}
                            />
                        </div>
                    </motion.div>
                    {/* Console Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className={`${bgConsole} ${borderColor} border rounded-xl shadow-[0_12px_50px_-22px_rgba(14,165,233,0.25)] p-4 flex flex-col ${layoutMode === 'bottom' ? 'overflow-y-auto' : 'overflow-hidden'} transition-all duration-300 min-h-0 ${layoutMode === 'bottom' ? 'h-[40vh]' : ''}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold">Console</h2>
                        </div>

                        {/* Input & Output Container */}
                        <div className="flex flex-col gap-4 flex-1 min-h-0">
                            {/* Input Box */}
                            <div className="flex flex-col h-[40%]">
                                <h3 className="text-sm font-semibold mb-1">Input</h3>
                                <textarea
                                    placeholder="Enter input here..."
                                    value={currentFile?.input}
                                    onChange={e => handleInputChange(e.target.value)}
                                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm outline-none resize-none
                      ${
                          isDark
                              ? 'bg-black/70 text-zinc-300 border border-white/10 placeholder-zinc-600'
                              : 'bg-white/70 text-zinc-800 border border-black/10 placeholder-zinc-400'
                      }`}
                                />
                            </div>

                            {/* Output Box  */}
                            <div className="flex flex-col h-[60%]">
                                <h3 className="text-sm font-semibold mb-1">Output</h3>
                                <div
                                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm overflow-auto
                      ${
                          isDark
                              ? 'bg-black/80 text-emerald-400 border border-white/10'
                              : 'bg-white/80 text-emerald-700 border border-black/10'
                      }`}
                                >
                                    {currentFile.output ? currentFile.output : '(no output yet)'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Subtle status bar */}
                <div className={`mt-2 text-xs ${textMuted} flex items-center gap-4`}>
                    <span className="inline-flex items-center gap-1"><Code2 size={12} className="text-sky-400" /> {currentFile?.language}</span>
                    <span>UTF-8</span>
                    <span>Ln -, Col -</span>
                </div>
            </motion.main>
            </div>
            {isEditorFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/90 p-4">
                    <div className={`${bgPanel} ${borderColor} border rounded-xl h-full flex flex-col overflow-hidden`}>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-700 p-2">
                            <h2 className="text-lg font-semibold">Editor</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    title="Copy code"
                                    aria-label="Copy code"
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                    onClick={() => navigator.clipboard.writeText(currentFile.code || '')}
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    title="Clear code"
                                    aria-label="Clear code"
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                    onClick={() => updateFile(currentFile.id, { code: '', saved: false })}
                                >
                                    <Eraser size={16} />
                                </button>
                                <button
                                    title="Add note"
                                    aria-label="Add note"
                                    className={`p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer glow-green`}
                                    onClick={() => setShowNote(true)}
                                >
                                    <FilePlus size={16} />
                                </button>
                                <button
                                    title="Exit full screen"
                                    onClick={() => setIsEditorFullscreen(false)}
                                    className={`p-2 rounded-md ${hoverBg} border ${borderColor} cursor-pointer`}
                                >
                                    <Minimize2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 mt-2">
                            <Editor
                                height="100%"
                                theme={isDark ? 'vs-dark' : 'light'}
                                language={currentFile?.language || 'javascript'}
                                value={currentFile?.code}
                                onChange={handleEditorChange}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {showNote && (
                <NoteModal
                    title="IDE Note"
                    initialContent={''}
                    onClose={() => setShowNote(false)}
                    onSave={async ({ title, content }) => {
                        // TODO: wire this to your notes backend if desired.
                        // For now, just copy the note content to the clipboard as a convenience.
                        try { await navigator.clipboard.writeText(`# ${title}\n\n${content}`); } catch {}
                    }}
                />
            )}
        </div>
    );
}
