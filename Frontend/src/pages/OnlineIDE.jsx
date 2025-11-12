import { useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
import {
  Play,
  Plus,
  Save,
  FileText,
  Download,
  Search,
  Code2,
  X,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Menu,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { deleteFolder, deleteNode, fetchFiles, renameFolder, renameNode, saveNode } from "../features/ideSlicer"
import Loader from "../components/Loader"
import { createPortal } from "react-dom"
import toast from 'react-hot-toast'

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "R", value: "r" },
  { label: "Scala", value: "scala" },
  { label: "Perl", value: "perl" },
  { label: "Haskell", value: "haskell" },
  { label: "Lua", value: "lua" },
  { label: "Dart", value: "dart" },
  { label: "Bash", value: "bash" },
]

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
}

const Modal = ({ isOpen, title, onClose, onConfirm, children, confirmText = "Create", loading=true }) => {
  if (!isOpen) return null
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-96 shadow-2xl border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition">
            Cancel
          </button>
          <button
          disabled={loading}
          onClick={onConfirm} className="px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex justify-center items-center gap-2 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}


const FileTree = ({ files, currentFileId, onSelectFile, isDark, onContextMenu, setShowRenameModalFile, setRenameValue,setSelectedItem,setShowDeleteModal, setShowCreateFileModal, setShowCreateFolderModal, setIsFolder, setShowRenameModalFolder }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, target: null })
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu({ ...contextMenu, visible: false })
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [contextMenu])

  const handleContextMenu = (e, target) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target,
    })
  }

  const handleMenuAction = (action) => {
    if (!contextMenu.target) return

    if (contextMenu.target._file) {

      if (action === "rename") {
        setShowRenameModalFile(true)
        setSelectedItem(contextMenu.target._file.name);
        setRenameValue(contextMenu.target._file.name);
      }
      if (action === "delete") {
        setShowDeleteModal(true)
        // console.log("Delete file:", contextMenu.target._file)
        setSelectedItem(contextMenu.target._file.name);

      }
      } else if (contextMenu.target.isFolder) {
    
    if (action === "rename") {
      setIsFolder(true);
      console.log("Rename folder:", contextMenu.target.path)
      setShowRenameModalFolder(true)
      setSelectedItem(contextMenu.target.path);
      setRenameValue(contextMenu.target.path.split('/').pop());
      }
      if (action === "delete") {
        setIsFolder(true);
        setShowDeleteModal(true)
        setSelectedItem(contextMenu.target.path);
        console.log("Delete folder:", contextMenu.target.path)
      }
      if (action === "createFile") {
        setIsFolder(true);
        setShowCreateFileModal(true);
        setSelectedItem(contextMenu.target.path);
        console.log("Create file in folder:", contextMenu.target.path)
      }
      if (action === "createFolder") {
        setIsFolder(true);
        setShowCreateFolderModal(true);
        setSelectedItem(contextMenu.target.path);
        console.log("Create folder in folder:", contextMenu.target.path)
      }
    }

    setContextMenu({ ...contextMenu, visible: false })
  }

  //   const buildTree = () => {
  //   const tree = {}

  //   files.forEach((file) => {
  //     const parts = file.name.split("/").filter((p) => p)
  //     let current = tree

  //     for (let i = 0; i < parts.length; i++) {
  //       const part = parts[i]
  //       const isFile = i === parts.length - 1

  //       if (!current[part]) {
  //         current[part] = isFile ? { _file: file } : {}
  //       }
  //       if (!isFile) {
  //         current = current[part]
  //       }
  //     }
  //   })

  //   return tree
  // }
  const buildTree = () => {
  const tree = {}

  files.forEach((file) => {
    // Remove empty segments, but keep info about trailing slash
    const isFolder = file.name.endsWith("/")
    const parts = file.name.split("/").filter((p) => p)
    let current = tree

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1
      const isFile = isLast && !isFolder

      // Create node if not exist
      if (!current[part]) {
        current[part] = isFile ? { _file: file } : {}
      }

      // Move deeper if folder
      if (!isFile) {
        current = current[part]
      }
    }
  })

  return tree
}



  const tree = buildTree()

  const renderTree = (obj, path = "") => {
    return Object.entries(obj).map(([name, content]) => {
      const fullPath = path ? `${path}/${name}` : name
      const isFile = content._file
      const isExpanded = expandedFolders.has(fullPath)

      if (isFile) {
        return (
          <div
            key={content._file.id}
            onClick={() => onSelectFile(content._file.id)}
            onContextMenu={(e) => handleContextMenu(e, content)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer text-sm ${
              content._file.id === currentFileId
                ? "bg-blue-600/30 text-blue-400"
                : "hover:bg-gray-700/50"
            }`}
          >
            <File size={14} />
            <span className="truncate">{name}</span>
          </div>
        )
      }

      return (
        <div key={fullPath}>
          <div
            onClick={() => {
              const newSet = new Set(expandedFolders)
              newSet.has(fullPath) ? newSet.delete(fullPath) : newSet.add(fullPath)
              setExpandedFolders(newSet)
            }}
            onContextMenu={(e) => handleContextMenu(e, { isFolder: true, path: fullPath })}
            className="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer hover:bg-gray-700/50"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} />
            <span className="truncate text-sm font-medium">{name}</span>
          </div>
          {isExpanded && (
            <div className="ml-5 border-l border-gray-700">{renderTree(content, fullPath)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="relative text-gray-200">
      {renderTree(tree)}

      {/* ✅ Context Menu */}
      {contextMenu.visible && createPortal(
        <div
          ref={menuRef}
          className="absolute bg-gray-800 border border-gray-700 rounded shadow-lg text-sm w-40 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.target?._file ? (
            <>
            <div className="">

            
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("rename")}
              >
                Rename
              </div>
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("delete")}
              >
                Delete
              </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("rename")}
              >
                Rename
              </div>
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("delete")}
              >
                Delete
              </div>
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("createFile")}
              >
                Create File
              </div>
              <div
                className="px-3 py-1.5 text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMenuAction("createFolder")}
              >
                Create Folder
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}



export default function OnlineIDE() {
  const makeId = (prefix = "f") => `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`
  const { id } = useParams()
    const { loading_fetch, currFiles, loading_general } = useSelector((state) => state.ide)
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchdata() {
            if (id === undefined) return;
            try {
                console.log("sendgin", id)
                let response = await dispatch(fetchFiles({ roadmapId: id }))
                console.log("Fetched files:", response)
            } catch (err) {
                console.error("Error fetching files:", err)
            }
        }

        fetchdata()
    }, [id, dispatch])

  const [files, setFiles] = useState(() => [
    {
      id: makeId("main"),
      name: "/main.js",
      language: "javascript",
      code: defaultCodeSnippets.javascript,
      input: "",
      output: "",
      saved: true,
    },
    {
      id: makeId("file"),
      name: "/folder/script.py",
      language: "python",
      code: defaultCodeSnippets.python,
      input: "",
      output: "",
      saved: true,
    },
  ])

  const [currentFileId, setCurrentFileId] = useState(files[0].id)
  const [filter, setFilter] = useState("")
  const [theme, setTheme] = useState("dark")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef(null)
  const tabContainerRef = useRef(null)

  const [showCreateFileModal, setShowCreateFileModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showRenameModalFile, setShowRenameModalFile] = useState(false)
  const [showRenameModalFolder, setShowRenameModalFolder] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [renameValue, setRenameValue] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [isFolder, setIsFolder] = useState(false);

  const currentFile = files.find((f) => f.id === currentFileId) || files[0]

  function updateFile(fileId, patch) {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...patch } : f)))
  }

  async function handleCreateFile() {
    console.log("Create file:", newFileName)
    let filePath = "";
    if(selectedItem!==null && selectedItem!==undefined) filePath = "/"+selectedItem+"/"+newFileName;
    else filePath = "/"+newFileName;
    console.log("Selected path for new file:", filePath)
    try{

      let response = await dispatch(saveNode({roadmapId: id, filePath: filePath, content: ""}))
      response = response.payload;
      console.log(response);
      if(!response.success){
        toast.error("Failed to create file.")
      }
      toast.success(`${newFileName} created successfully.`);
    }catch(error){
      toast.error(error.message);
    }
    if(isFolder){
      setIsFolder(false);
    }
    setSelectedItem(null);  
    setShowCreateFileModal(false)
    setNewFileName("")
  }

  async function handleCreateFolder() {
    console.log("Create folder:", newFolderName)
    // TODO: Implement folder creation logic

    let folderPath = "";
    if(selectedItem!==null && selectedItem!==undefined) folderPath = "/"+selectedItem+"/"+newFolderName+"/";
    else folderPath = "/"+newFolderName+"/";
    console.log("Selected path for new folder:", folderPath)
    try{

      let response = await dispatch(saveNode({roadmapId: id, filePath: folderPath, content: ""}))
      response = response.payload;
      console.log(response);
      if(!response.success){
        toast.error("Failed to create file.")
      }
      toast.success(`${newFileName} created successfully.`);
    }catch(error){
      toast.error(error.message);
    }

    if(isFolder){
      setIsFolder(false);
    }
    setSelectedItem(null);  
    setShowCreateFolderModal(false)
    setNewFolderName("")
  }

  async function handleDeleteFile() {
    console.log("Delete file:", selectedItem)
    let filePath = selectedItem;
    if(!filePath.startsWith('/')){
      filePath = "/"+filePath;
    }
    if(isFolder){
      if(!filePath.endsWith('/')) filePath = filePath + '/';
    }
    console.log("Selected path for deletion:", filePath)
    // TODO: Implement file deletion logic
    try{
      let response;
      if(isFolder){
        response = await dispatch(deleteFolder({roadmapId: id, filePath: filePath}))
      }else{
        response = await dispatch(deleteNode({roadmapId: id, filePath: filePath}))
      }
      response = response.payload;
      console.log(response);
      if(!response.success){
        toast.error("Failed to delete file.")
      }
      toast.success(`${selectedItem.split('/').pop()} delete successfully.`);
    }catch(error){
      toast.error(error.message);
    }
    if(isFolder){
      setIsFolder(false);
    }
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  async function handleRenameFile() {
    console.log("Rename to:", renameValue)

    try{
      const newpathArray = selectedItem.split('/');
      newpathArray.pop();
      const newpath = newpathArray.join('/') + '/' + renameValue;

      console.log("Renaming:", selectedItem, "to", newpath);
      let response = await dispatch(renameNode({roadmapId: id, oldFilePath: selectedItem, newFilePath: newpath}))
      response = response.payload;
      console.log(response);
      if(!response.success){
        toast.error("Failed to rename file.")
      }
      toast.success(`${selectedItem.split('/').pop()} renamed successfully.`);
    }catch(error){
      toast.error(error.message);
    }
    
    if(isFolder){
      setIsFolder(false);
    }
    setShowRenameModalFile(false)
    setRenameValue("")
    setSelectedItem(null)
  }
  async function handleRenameFolder() {

    try{
      const newpathArray = selectedItem.split('/');
      newpathArray.pop();
      let newpath = newpathArray.join('/') + '/' + renameValue;
      if(!newpath.endsWith('/')){
        newpath = newpath + '/';
      }
      if(!newpath.startsWith('/')){
        newpath = "/"+newpath;
      }

      let oldpath = selectedItem;
      if(!oldpath.startsWith('/')){
        oldpath = "/"+oldpath;
      }
      if(!oldpath.endsWith('/')){
        oldpath = oldpath + '/';
      }

      // console.log("Renaming:", oldpath, "to", newpath);
      let response = await dispatch(renameFolder({roadmapId: id, oldFilePath: oldpath, newFilePath: newpath}))
      response = response.payload;
      console.log(response);
      if(!response.success){
        toast.error("Failed to rename folder.")
      }
      toast.success(`${selectedItem.split('/').pop()} renamed successfully.`);
    }catch(error){
      toast.error(error.message);
    }
    
    if(isFolder){
      setIsFolder(false);
    }
    setShowRenameModalFolder(false)
    setRenameValue("")
    setSelectedItem(null)
  }

  function handleContextMenu(e, item) {
    e.preventDefault()
    setSelectedItem(item)
    // Could implement context menu here or trigger modals
  }

  function removeFile(fileId) {
    const fileToRemove = files.find((f) => f.id === fileId)
    if (!fileToRemove) return
    const ok = window.confirm(`Delete '${fileToRemove.name}'?`)
    if (!ok) return
    setFiles((p) => p.filter((f) => f.id !== fileId))
    if (currentFileId === fileId) setCurrentFileId(files[0]?.id || null)
  }

  function renameFile(fileId) {
    const f = files.find((x) => x.id === fileId)
    if (!f) return
    const newName = window.prompt("Rename file", f.name)
    if (newName && newName.trim()) updateFile(fileId, { name: newName.trim(), saved: false })
  }

  function changeLanguageForFile(fileId, language) {
    updateFile(fileId, {
      language,
      code: defaultCodeSnippets[language] || "",
      saved: false,
    })
  }

  function handleEditorChange(value) {
    updateFile(currentFileId, { code: value || "", saved: false })
  }

  function handleInputChange(value) {
    updateFile(currentFileId, { input: value || "", saved: false })
  }

  function saveCurrentFile() {
    if (!currentFile) return
    updateFile(currentFile.id, { saved: true })
  }

  function downloadFile(file) {
    const blob = new Blob([file.code || ""], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function runCode() {
    if (!currentFile || !currentFile.code.trim()) {
      alert("No code to run!")
      return
    }

    setIsRunning(true)
    updateFile(currentFile.id, { output: "Running..." })

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
                `main.${
                  currentFile.language === "python"
                    ? "py"
                    : currentFile.language === "javascript"
                      ? "js"
                      : currentFile.language === "java"
                        ? "java"
                        : "cpp"
                }`,
              content: currentFile.code,
            },
          ],
          args: [],
          stdin: currentFile.input || "",
        }),
      })

      const data = await response.json()

      if (!data.success) {
        updateFile(currentFile.id, { output: `Error: ${data.message}` })
      } else {
        const pistonResult = data.data?.run || {}
        const finalOutput = pistonResult.output || pistonResult.stderr || "(no output)"
        updateFile(currentFile.id, { output: finalOutput })
      }
    } catch (err) {
      updateFile(currentFile.id, { output: "Execution failed: " + err.message })
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    const handler = (e) => {
      const modKey = e.ctrlKey || e.metaKey
      if (modKey && e.key.toLowerCase() === "s") {
        e.preventDefault()
        saveCurrentFile()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [currentFileId, files])

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

  const isDark = theme === "dark"
  const bgPanel = isDark ? "bg-gray-900" : "bg-white"
  const borderColor = isDark ? "border-gray-800" : "border-gray-300"
  const textMuted = isDark ? "text-gray-400" : "text-gray-500"
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"


  if(loading_fetch===true){      return <Loader />
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"} 
      p-4 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 transition-colors duration-300`}
    >
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
        <aside
          className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-3 flex flex-col gap-3 h-full transition-all duration-300`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Code2 size={20} className="text-blue-500" />
              <h2 className="font-semibold text-lg">Web IDE</h2>
            </div>
            <button onClick={toggleTheme} className={`p-2 rounded-md ${hoverBg} transition`}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <h3 className={`uppercase text-xs font-semibold tracking-wider ${textMuted}`}>Files</h3>
            </div>
            <button
              onClick={() => setShowCreateFileModal(true)}
              title="New file"
              className="p-2 rounded-md bg-green-600 hover:bg-green-700 active:scale-95 transition-transform"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className={`flex items-center gap-2 ${isDark ? "bg-gray-800" : "bg-gray-100"} rounded-md px-2 py-1`}>
            <Search size={16} className={textMuted} />
            <input
              placeholder="Search files..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent flex-1 text-sm outline-none"
            />
          </div>

          <div className="flex-1 overflow-auto mt-1">
            <FileTree
              files={currFiles}
              currentFileId={currentFileId}
              onSelectFile={setCurrentFileId}
              isDark={isDark}
              onContextMenu={handleContextMenu}
              setShowRenameModalFile={setShowRenameModalFile}
              setRenameValue={setRenameValue}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
              setShowCreateFileModal={setShowCreateFileModal}
              setShowCreateFolderModal={setShowCreateFolderModal}
              setIsFolder={setIsFolder}
              setShowRenameModalFolder={setShowRenameModalFolder}
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-700">
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex-1 py-2 px-3 text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Folder size={14} />
              Folder
            </button>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`${bgPanel} ${borderColor} border p-2 rounded-lg w-fit`}
        >
          <Menu size={20} />
        </button>

        {/* Main Part */}
        <main className="flex flex-col gap-3 overflow-hidden">
          {/* Tabs */}
          <div className={`flex items-center justify-between gap-3 flex-shrink-0 border-b ${borderColor} pb-1`}>
            <div
              ref={tabContainerRef}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            >
              {currFiles.map((f) => (
                <div
                  key={f.id}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-all duration-150 ${
                    f.id === currentFileId
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-transparent hover:bg-gray-200/20"
                  } rounded-t-md cursor-pointer flex-shrink-0`}
                >
                  <button onClick={() => setCurrentFileId(f.id)} className="flex items-center gap-2">
                    <span>{f.name}</span>
                    {!f.saved && <span className="text-xs text-yellow-500">•</span>}
                  </button>
                  {currFiles.length > 1 && (
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
                onChange={(e) => changeLanguageForFile(currentFile.id, e.target.value)}
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
                onClick={runCode}
                title="Run code"
                disabled={isRunning}
                className={`${bgPanel} ${borderColor} border flex items-center gap-2 px-3 py-2 rounded-lg
                            ${isRunning ? "opacity-70 cursor-wait" : "hover:scale-95 transition"}`}
              >
                <Play size={16} />
                {isRunning ? "Running..." : "Run"}
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

          {/* Editor and Console */}
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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Console</h2>
                <div className="flex gap-3 text-sm text-blue-400">
                  <button
                    className="hover:underline"
                    onClick={() => navigator.clipboard.writeText(currentFile.input || "")}
                  >
                    Copy
                  </button>
                  <button
                    className="hover:underline"
                    onClick={() => updateFile(currentFile.id, { input: "", output: "" })}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-1 min-h-[400px]">
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
                    {currentFile.output ? currentFile.output : "(no output yet)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={showCreateFileModal}
        title="Create New File"
        onClose={() => {setIsFolder(false);setShowCreateFileModal(false)}}
        onConfirm={handleCreateFile}
        confirmText="Create"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="e.g., script.js"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>
      {/* <Modal
        isOpen={showRenameModalFile}
        title="Rename File"
        onClose={() => setShowRenameModalFile(false)}
        onConfirm={handleRenameFile}
        confirmText="Rename"
      >
        <input
          type="text"
          placeholder="e.g., script.js"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal> */}
      

      <Modal
        isOpen={showCreateFolderModal}
        title="Create New Folder"
        onClose={() => {setIsFolder(false);setShowCreateFolderModal(false)}}
        onConfirm={handleCreateFolder}
        confirmText="Create"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="e.g., src"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>

      <Modal
        isOpen={showRenameModalFile}
        title="Rename File"
        onClose={() => {setIsFolder(false);setShowRenameModalFile(false)}}
        onConfirm={handleRenameFile}
        confirmText="Rename"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="New name"
          value={renameValue.split('/').pop()}
          onChange={(e) => setRenameValue(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>
      <Modal
        isOpen={showRenameModalFolder}
        title="Rename Folder"
        onClose={() => {setIsFolder(false);setShowRenameModalFolder(false)}}
        onConfirm={handleRenameFolder}
        confirmText="Rename"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="New name"
          value={renameValue.split('/').pop()}
          onChange={(e) => setRenameValue(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        onClose={() => {setIsFolder(false);setShowDeleteModal(false)}}
        onConfirm={handleDeleteFile}
        confirmText="Delete"
        loading={loading_general}
      >
        <p className="text-gray-300">
          Are you sure you want to delete <span className="font-semibold">{selectedItem?.split('/')?.pop()}</span>?
          {/* Are you sure you want to delete <span className="font-semibold"></span>? */}
        </p>
      </Modal>
    </div>
  )
}

// // {
// //     "files": [
// //         {
// //             "id": "s3_/file.cpp_0.5910843932213732",
// //             "name": "/file.cpp",
// //             "language": "cpp",
// //             "code": "#include <iostream>",
// //             "input": "",
// //             "output": "",
// //             "saved": true
// //         },
// //         {
// //             "id": "s3_/newfolder/file.py_0.17666537575322538",
// //             "name": "/newfolder/file.py",
// //             "language": "python",
// //             "code": "print('Hello world!')",
// //             "input": "",
// //             "output": "",
// //             "saved": true
// //         }
// //     ]
// // }


// // {
// //   "key": "project/roadmapid",
// //   "filePath": "/newfolder/file.py",
// //   "content" : "print('Hello world!')"
// // }
