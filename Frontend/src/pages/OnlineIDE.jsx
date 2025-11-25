import { use, useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
import {
  Play,
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
  Loader2,
  FilePlus,
  FolderPlus,
  Sparkles, 
  Bot,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { deleteFolder, deleteNode, fetchFiles, renameFolder, renameNode, saveNode, setCurrFile, setCurrFiles, updateFileContent, executeCode, setIsRunning, analyseCode} from "../features/ideSlicer"
import Loader from "../components/Loader"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"

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

const Modal = ({ isOpen, title, onClose, onConfirm, children, confirmText = "Create", loading = true }) => {
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
            onClick={onConfirm}
            className="px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex justify-center items-center gap-2 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

const FileTree = ({
  files,
  onSelectFile,
  setShowRenameModalFile,
  setRenameValue,
  setSelectedItem,
  setShowDeleteModal,
  setShowCreateFileModal,
  setShowCreateFolderModal,
  setIsFolder,
  setShowRenameModalFolder,
}) => {
  const {currFile} = useSelector((state) => state.ide);
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
        setSelectedItem(contextMenu.target._file.name)
        setRenameValue(contextMenu.target._file.name)
      }
      if (action === "delete") {
        setShowDeleteModal(true)
        setSelectedItem(contextMenu.target._file.name)
      }
    } else if (contextMenu.target.isFolder) {
      if (action === "rename") {
        setIsFolder(true)
        setShowRenameModalFolder(true)
        setSelectedItem(contextMenu.target.path)
        setRenameValue(contextMenu.target.path.split("/").pop())
      }
      if (action === "delete") {
        setIsFolder(true)
        setShowDeleteModal(true)
        setSelectedItem(contextMenu.target.path)
      }
      if (action === "createFile") {
        setIsFolder(true)
        setShowCreateFileModal(true)
        setSelectedItem(contextMenu.target.path)
      }
      if (action === "createFolder") {
        setIsFolder(true)
        setShowCreateFolderModal(true)
        setSelectedItem(contextMenu.target.path)
      }
    }

    setContextMenu({ ...contextMenu, visible: false })
  }

  const buildTree = () => {
    const tree = {}

    files.forEach((file) => {
      const isFolder = file.name.endsWith("/")
      const parts = file.name.split("/").filter((p) => p)
      let current = tree

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const isLast = i === parts.length - 1
        const isFile = isLast && !isFolder

        if (!current[part]) {
          current[part] = isFile ? { _file: file } : {}
        }

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
            onClick={() => onSelectFile(content._file)
            }
            onContextMenu={(e) => handleContextMenu(e, content)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer text-sm ${
              content._file.id === currFile.id ? "bg-blue-600/30 text-blue-400" : "hover:bg-gray-700/50"
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
          {isExpanded && <div className="ml-5 border-l border-gray-700">{renderTree(content, fullPath)}</div>}
        </div>
      )
    })
  }

  return (
    <div className="relative text-gray-200">
      {renderTree(tree)}

      {contextMenu.visible &&
        createPortal(
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
          document.body,
        )}
    </div>
  )
}

const AnalysisModal = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;
  
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") 
      .replace(/^./, (str) => str.toUpperCase()); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-700 animate-in fade-in zoom-in duration-200">
        
        
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-900/50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Bot className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">AI Code Analysis</h2>
              <p className="text-xs text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors group"
          >
            <X className="text-gray-400 group-hover:text-white" size={20} />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
              <p className="text-gray-400 animate-pulse font-medium">Analyzing your code structure...</p>
            </div>
          ) : data ? (
            <div className="grid gap-4">
              {Object.entries(data).map(([key, value], index) => {
                
                const isMetric = key.toLowerCase().includes('complexity');
                
                return (
                  <div 
                    key={index} 
                    className={`
                      rounded-lg border p-4 transition-all hover:border-gray-600
                      ${isMetric ? 'bg-blue-900/10 border-blue-500/20' : 'bg-gray-800/50 border-gray-700'}
                    `}
                  >
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isMetric ? 'text-blue-400' : 'text-gray-400'}`}>
                      {formatKey(key)}
                    </h3>
                    
                    <div className="text-gray-200 text-sm leading-relaxed font-sans">
                      
                      {typeof value === 'object' && value !== null ? (
                        <pre className="font-mono text-xs text-blue-300 bg-black/50 p-3 rounded-md overflow-x-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) 
                      
                      : typeof value === 'boolean' ? (
                         <div className="flex items-center gap-2">
                           {value ? (
                             <>
                               <AlertTriangle className="text-red-500" size={18} />
                               <span className="text-red-400 font-bold">Yes</span>
                             </>
                           ) : (
                             <>
                               <CheckCircle className="text-green-500" size={18} />
                               <span className="text-green-400 font-bold">No</span>
                             </>
                           )}
                         </div>
                      ) 
                      : (
                        <span className={isMetric ? "font-mono text-lg font-bold text-blue-100" : "whitespace-pre-wrap"}>
                          {value}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Bot size={48} className="mb-2 opacity-20" />
              <p>No analysis data available.</p>
            </div>
          )}
        </div>

        
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none cursor-pointer bg-white text-black hover:bg-gray-200 font-medium rounded-lg transition-colors shadow-lg shadow-purple-900/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OnlineIDE() {
  const { id } = useParams()
  const { loading_fetch, currFiles, loading_general, currFile, is_saving, is_running, is_analyzing, analysisData } = useSelector((state) => state.ide)
  const dispatch = useDispatch()

  const [openedFileIds, setOpenedFileIds] = useState(new Set())
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    async function fetchdata() {
      if (id === undefined) return
      try {
        let response = await dispatch(fetchFiles({ roadmapId: id }))
      } catch (err) {
        console.error("Error fetching files:", err)
      }
    }

    fetchdata()
  }, [id, dispatch])



  const [filter, setFilter] = useState("")
  const [theme, setTheme] = useState("dark")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // const [isRunning, setIsRunning] = useState(false)
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
  const [isFolder, setIsFolder] = useState(false)
  const saveRef = useRef(null)
  const [tempState, setTempState] = useState(false);


  const filesForSidebar = currFiles.filter((f) => f.name.toLowerCase().includes(filter.toLowerCase()))
  const filesForTabs = currFiles.filter((f) => openedFileIds.has(f.id) && !f.name.endsWith("/"))

  async function handleAnalyse() {
    if (!currFile || !currFile.code.trim()) {
      toast.error("File is empty. Write some code to analyze.");
      return;
    }
    
    setShowAnalysisModal(true); 
    
    try {
      
      let response = await dispatch(analyseCode({ 
          code: currFile.code, 
          name: currFile.name 
      }));

      response = response.payload;
      console.log("Anaasdfasdfdslysis response:", response);
      if(!response.success){
        toast.error(response.message || "Failed to analyze code.");
        setShowAnalysisModal(false);
        return;
      }
      
    } catch (error) {
      console.error(error);
      setShowAnalysisModal(false);
    }
  }
  async function handleCreateFile() {
    let filePath = ""
    if (selectedItem !== null && selectedItem !== undefined) filePath = "/" + selectedItem + "/" + newFileName
    else filePath = "/" + newFileName
    try {
      let response = await dispatch(saveNode({ roadmapId: id, name: newFileName, filePath: filePath, content: "" }))
      response = response.payload
      if (!response.success) {
        toast.error(response.message || "Failed to create file.")
        return;
      }
      toast.success(`${newFileName} created successfully.`)
    } catch (error) {
      toast.error(error.message)
    }
    if (isFolder) {
      setIsFolder(false)
    }
    setSelectedItem(null)
    setShowCreateFileModal(false)
    setNewFileName("")
  }

  async function handleCreateFolder() {

    let folderPath = ""
    if (selectedItem !== null && selectedItem !== undefined) folderPath = "/" + selectedItem + "/" + newFolderName + "/"
    else folderPath = "/" + newFolderName + "/"
    try {
      let response = await dispatch(saveNode({ roadmapId: id, name: newFolderName, filePath: folderPath, content: "" }))
      response = response.payload
      if (!response.success) {
        toast.error(response.message || "Failed to create folder.")
        return;
      }
      toast.success(`${newFileName} created successfully.`)
    } catch (error) {
      toast.error(error.message)
    }

    if (isFolder) {
      setIsFolder(false)
    }
    setSelectedItem(null)
    setShowCreateFolderModal(false)
    setNewFolderName("")
  }

  async function handleDeleteFile() {
    let filePath = selectedItem
    if (!filePath.startsWith("/")) {
      filePath = "/" + filePath
    }
    if (isFolder) {
      if (!filePath.endsWith("/")) filePath = filePath + "/"
    }
    try {
      let response
      if (isFolder) {
        response = await dispatch(deleteFolder({ roadmapId: id, filePath: filePath }))
      } else {
        response = await dispatch(deleteNode({ roadmapId: id, filePath: filePath }))
      }
      response = response.payload
      if (!response.success) {
        toast.error("Failed to delete file.")
      }
      toast.success(`${selectedItem.split("/").pop()} delete successfully.`)
    } catch (error) {
      toast.error(error.message)
    }
    if (isFolder) {
      setIsFolder(false)
    }
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  async function handleRenameFile(setTempState) {

    try {
      const newpathArray = selectedItem.split("/")
      newpathArray.pop()
      const newpath = newpathArray.join("/") + "/" + renameValue

      let response = await dispatch(renameNode({ roadmapId: id, name: renameValue, oldFilePath: selectedItem, newFilePath: newpath }))
      response = response.payload
      if (!response.success) {
        toast.error(response.message || "Failed to rename file.")
        return;
      }
      toast.success(`${selectedItem.split("/").pop()} renamed successfully.`)
      setTempState(false);
    } catch (error) {
      toast.error(error.message)
    }

    if (isFolder) {
      setIsFolder(false)
    }
    setShowRenameModalFile(false)
    setRenameValue("")
    setSelectedItem(null)
  }
  async function handleRenameFolder(setTempState) {
    try {
      const newpathArray = selectedItem.split("/")
      newpathArray.pop()
      let newpath = newpathArray.join("/") + "/" + renameValue
      if (!newpath.endsWith("/")) {
        newpath = newpath + "/"
      }
      if (!newpath.startsWith("/")) {
        newpath = "/" + newpath
      }

      let oldpath = selectedItem
      if (!oldpath.startsWith("/")) {
        oldpath = "/" + oldpath
      }
      if (!oldpath.endsWith("/")) {
        oldpath = oldpath + "/"
      }

      let response = await dispatch(renameFolder({ roadmapId: id, name: renameValue, oldFilePath: oldpath, newFilePath: newpath }))
      response = response.payload
      if (!response.success) {
        toast.error(response.message || "Failed to rename folder.")
        return;
      }
      toast.success(`${selectedItem.split("/").pop()} renamed successfully.`)
      setTempState(false);
    } catch (error) {
      toast.error(error.message)
    }

    if (isFolder) {
      setIsFolder(false)
    }
    setShowRenameModalFolder(false)
    setRenameValue("")
    setSelectedItem(null)
  }


  async function closeFile(fileId) {
    const newOpened = new Set(openedFileIds)
    newOpened.delete(fileId)
    setOpenedFileIds(newOpened)

    if (currFile.id === fileId) {
      const remainingFiles = filesForTabs.filter((f) => f.id !== fileId)
      if (remainingFiles.length > 0) {
        await dispatch(setCurrFile(remainingFiles[remainingFiles.length-1]))
      } else {
        await dispatch(setCurrFile({code:"", id:"", input:"", language:"", name:"", output:"", saved: false}))
      }
    }
  }

  async function handleSelectFileFromSidebar(fileId) {
    const file_id = fileId.id
    const file = currFiles.find((f) => f.id === file_id)
    if (file && !file.name.endsWith("/")) {
      await dispatch(setCurrFile(fileId));
      setOpenedFileIds((prev) => new Set([...prev, file_id]))
      // setCurrentFileId(file_id)
    }
  }


  function handleEditorChange(value) {
    dispatch(setCurrFiles(currFiles.map(file => {
      if(file.id == currFile.id){
        return {
          ...file,
          code: value,
          saved: false
        }
      }
      return file;
    })))
    dispatch(setCurrFile({...currFile, code: value}));

    
  }

  async function handleInputChange(e) {
    await dispatch(setCurrFile({...currFile, input: e.target.value}))
    dispatch(setCurrFiles(currFiles.map(file => {
      if(file.id == currFile.id){
        return {
          ...file,
          input: e.target.value,
        }
      }
      return file;
    })));
  }

  async function saveCurrentFile() {
    if (!currFile) return
    try{
      let response = await dispatch(updateFileContent({roadmapId: id, filePath: currFile.name, content: currFile.code}));
      response = response.payload;
      if(!response.success){
        toast.error(response.message);
        return;
      }
      toast.success("Files saved successfully");
    }catch(error){
      toast.error("Error in saving file");
    }

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
    if (!currFile || !currFile.code.trim()) {
      toast.error("No code to run.")
      return;
    }

    await dispatch(setIsRunning(true));
    try{
      // const fileToBeExecuted = [
      //   currFiles.find(f => f.id === currFile.id),
      //   ...currFiles.filter(f => f.id !== currFile.id)
      // ];
      const fileToBeExecuted = [
        {...currFile,name: currFile.name.split('/').pop()}
      ];

      let response = await dispatch(executeCode({language: currFile.language, files: fileToBeExecuted, stdin: currFile.input || "", }));
      response = response.payload;
      // console.log(response.data.run);

      await dispatch(setCurrFile({...currFile, output: response.data.run.output || ""}))
    dispatch(setCurrFiles(currFiles.map(file => {
      if(file.id == currFile.id){
        return {
          ...file,
          output: response.data.run.output || "",
        }
      }
      return file;
    })));


    }catch(error){
      toast.error("Error in running code"); 
    }
    await dispatch(setIsRunning(false));
  }

  // async function runCode() {
  //   if (!currFile || !currFile.code.trim()) {
  //     toast.error("No code to run.");
  //     return;
  //   }

  //   await dispatch(setIsRunning(true));
  //   try{

  //     // 1. Get the current file, ensuring its name is just the base name.
  //     // This will be the main entry point for execution.
  //     const mainFile = {
  //       name: currFile.name.split('/').pop(),
  //       code: currFile.code
  //     };

  //     // 2. Get all *other* files from your project.
  //     // We filter out the current file (to avoid duplicates) and any folders.
  //     const otherFiles = currFiles
  //       .filter(f => f.id !== currFile.id && !f.name.endsWith('/'))
  //       .map(f => ({
  //         name: f.name.split('/').pop(), // Use base name for imports
  //         code: f.code
  //       }));

  //     // 3. Combine them, with the mainFile *first* in the array.
  //     const filesToSend = [mainFile, ...otherFiles];
      

  //     console.log("Files to be sent for execution:", filesToSend.map(f => f.name)); // Better logging
      
  //     let response = await dispatch(executeCode({
  //       language: currFile.language, 
  //       files: filesToSend, // Send the complete array
  //       stdin: currFile.input || "", 
  //     }));
      
  //     response = response.payload;
      
  //     // Prioritize stderr for displaying compile/runtime errors
  //     const output = (response.data?.run?.stderr || response.data?.run?.output) || "";

  //     // Update the state with the output
  //     await dispatch(setCurrFile({...currFile, output: output}))
  //     dispatch(setCurrFiles(currFiles.map(file => {
  //       if(file.id == currFile.id){
  //         return {
  //           ...file,
  //           output: output,
  //         }
  //       }
  //       return file;
  //     })));

  //   }catch(error){
  //     console.error("Error running code:", error); // Good to log the full error
  //     toast.error("Error in running code"); 
  //   }
  //   await dispatch(setIsRunning(false));
  // }

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey  && e.key.toLowerCase() === "s") {
        e.preventDefault()
        saveRef.current.click();
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  })

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

  const isDark = theme === "dark"
  const bgPanel = isDark ? "bg-gray-900" : "bg-white"
  const borderColor = isDark ? "border-gray-800" : "border-gray-300"
  const textMuted = isDark ? "text-gray-400" : "text-gray-500"
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"


  // useEffect(() => {
  //       const onKey = e => {
  //           if (e.ctrlKey && e.key.toLowerCase() === 's') {
  //             if(currFile){
  //               e.preventDefault();
  //               dispatch(saveCurrentFile());
  //             }
  //           }

  //       };
  //       window.addEventListener("keydown", onKey);
  //       return () => window.removeEventListener("keydown", onKey);
  //   });

  if (loading_fetch === true) {
    return <Loader />
  }

  return (
    <div
      className={`h-screen w-full overflow-hidden ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      } p-4 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 transition-colors duration-300`}
    >
      <div
        className={`h-full transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <aside
          className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-3 flex flex-col gap-3 h-full transition-all duration-300`}
        >
    
          <div className="flex items-center justify-between pb-2 border-b border-gray-700 shrink-0">
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

          
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <h3
                className={`uppercase text-xs font-semibold tracking-wider ${textMuted}`}
              >
                Files
              </h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateFileModal(true)}
                title="New file"
                className="p-1 cursor-pointer rounded-md bg-slate-600 hover:bg-slate-700 active:scale-95 transition-transform"
              >
                <FilePlus size={16} />
              </button>
              <button
                onClick={() => setShowCreateFolderModal(true)}
                title="New folder"
                className="p-1 cursor-pointer rounded-md bg-slate-600 hover:bg-slate-700 active:scale-95 transition-transform"
              >
                <FolderPlus size={16} />
              </button>
            </div>
          </div>

          {/* ... Search ... */}
          <div
            className={`flex items-center gap-2 shrink-0 ${
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

          {/* ... File Tree ... */}
          {/* CHANGE 3: This needs min-h-0 to scroll internally */}
          <div className="flex-1 overflow-auto mt-1 min-h-0 custom-scrollbar">
            <FileTree
              files={filesForSidebar}
              onSelectFile={handleSelectFileFromSidebar}
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
        </aside>
      </div>

      {/* Main Content Column */}
      {/* CHANGE 4: Added h-full and min-h-0 overflow-hidden */}
      <div className="flex flex-col gap-4 h-full min-h-0 overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`${bgPanel} ${borderColor} border p-2 rounded-lg w-fit flex-shrink-0`}
        >
          <Menu size={20} />
        </button>

        {/* CHANGE 5: main needs flex-1 and min-h-0 */}
        <main className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
          {/* Top Bar (Tabs + Buttons) */}
          <div
            className={`flex items-center justify-between gap-3 flex-shrink-0 border-b ${borderColor} pb-1`}
          >
            <div
              ref={tabContainerRef}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            >
              {filesForTabs.map((f) => (
                <div
                  key={f.id}
                  ref={saveRef}
                  onClick={async () => {
                    await dispatch(setCurrFile(f));
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-all duration-150 ${
                    f.id === currFile.id
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-transparent hover:bg-gray-200/20"
                  } rounded-t-md cursor-pointer flex-shrink-0`}
                >
                  <button className="flex cursor-pointer items-center gap-2">
                    <span>{f.name}</span>
                    {!f.saved && (
                      <span className="text-xs text-yellow-500">•</span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(f.id);
                    }}
                    title="Close file"
                    className="
                        cursor-pointer rounded-md px-1 py-0.5
                        text-gray-400
                        transition-colors
                        hover:text-red-500 hover:bg-red-500/10"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`${bgPanel} ${borderColor} border font-medium px-3 py-2 rounded-lg text-sm`}
              >
                {currFile?.language || "None"}
              </div>

              <button
                onClick={saveCurrentFile}
                disabled={is_saving}
                className={`${bgPanel} ${borderColor} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none border flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-95 active:scale-90 transition`}
              >
                {is_saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {is_saving ? "Saving" : "Save"}
              </button>

              <button
                onClick={runCode}
                title="Run code"
                disabled={is_running}
                className={`${bgPanel} ${borderColor} border flex items-center gap-2 px-3 py-2 rounded-lg
                            ${
                              is_running
                                ? "opacity-70 cursor-wait"
                                : "hover:scale-95 transition"
                            }`}
              >
                <Play size={16} />
                {is_running ? "Running..." : "Run"}
              </button>

              <div className="flex items-center gap-2 flex-shrink-0">
  
              <button
                onClick={handleAnalyse}
                disabled={is_analyzing || is_running}
                className={`${bgPanel} ${borderColor} border flex items-center gap-2 px-3 py-2 rounded-lg 
                hover:bg-purple-500/10 cursor-pointer hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300 group`}
                title="Analyse Code with AI"
              >
                {is_analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                ) : (
                    <Sparkles size={16} className="text-purple-500 group-hover:scale-110 transition-transform" />
                )}
                <span className={is_analyzing ? "text-purple-500" : ""}>
                    {is_analyzing ? "Thinking..." : "Analyse"}
                </span>
              </button>

</div>

              <button
                onClick={() => downloadFile(currFile)}
                title="Download file"
                className={`${bgPanel} ${borderColor} border flex items-center justify-center px-3 h-[40px] rounded-lg hover:scale-95 transition`}
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Editor & Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
            <div
              className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-4 flex flex-col h-full overflow-hidden transition-all duration-300`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-700 shrink-0">
                <h2 className="text-lg font-semibold">Editor</h2>
                <div className={`text-sm ${textMuted}`}>{currFile?.name}</div>
              </div>

              <div className="flex-1 mt-2 min-h-0">
                <Editor
                  height="100%"
                  theme={isDark ? "vs-dark" : "light"}
                  language={currFile?.language || "javascript"}
                  value={currFile.code}
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

        
            <div
              className={`${bgPanel} ${borderColor} border rounded-xl shadow-md p-4 flex flex-col h-full overflow-hidden transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h2 className="text-lg font-semibold">Console</h2>
                <div className="flex gap-3 text-sm text-blue-400">
                  <button
                    className="hover:underline"
                    onClick={() =>
                      navigator.clipboard.writeText(currFile?.input || "")
                    }
                  >
                    Copy
                  </button>
                  <button className="hover:underline">Clear</button>
                </div>
              </div>

              {/* Console Content */}
              <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
                <div className="flex flex-col h-[40%] min-h-0">
                  <h3 className="text-sm font-semibold mb-1 shrink-0">Input</h3>
                  <textarea
                    placeholder="Enter input here..."
                    value={currFile?.input}
                    onChange={(e) => handleInputChange(e)}
                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm outline-none resize-none
                      ${
                        isDark
                          ? "bg-black text-gray-300 border border-gray-700 placeholder-gray-600"
                          : "bg-gray-50 text-gray-800 border border-gray-300 placeholder-gray-400"
                      }`}
                  />
                </div>

                <div className="flex flex-col h-[60%] min-h-0">
                  <h3 className="text-sm font-semibold mb-1 shrink-0">
                    Output
                  </h3>
                  <div
                    className={`flex-1 w-full p-2 rounded-md font-mono text-sm overflow-auto
                      ${
                        isDark
                          ? "bg-black text-green-400 border border-gray-700"
                          : "bg-gray-50 text-green-700 border border-gray-300"
                      }`}
                  >
                    <pre>

                    {currFile?.output ? currFile.output : "(no output yet)"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals remain unchanged, just rendering them here for completeness */}
      <Modal
        isOpen={showCreateFileModal}
        title="Create New File"
        onClose={() => {
          setIsFolder(false);
          setShowCreateFileModal(false);
        }}
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

      <Modal
        isOpen={showCreateFolderModal}
        title="Create New Folder"
        onClose={() => {
          setIsFolder(false);
          setShowCreateFolderModal(false);
        }}
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
        onClose={() => {
          setIsFolder(false);
          setShowRenameModalFile(false);
          setTempState(false);
        }}
        onConfirm={()=>handleRenameFile(setTempState)}
        confirmText="Rename"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="New name"
          value={tempState?renameValue:renameValue.split("/").pop()}
          onChange={(e) => {
            setTempState(true);
            setRenameValue(e.target.value)
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>
      <Modal
        isOpen={showRenameModalFolder}
        title="Rename Folder"
        onClose={() => {
          setIsFolder(false);
          setShowRenameModalFolder(false);
          setTempState(false);
        }}
        onConfirm={()=>{handleRenameFolder(()=>setTempState)}}
        confirmText="Rename"
        loading={loading_general}
      >
        <input
          type="text"
          placeholder="New name"
          value={tempState?renameValue:renameValue.split("/").pop()}
          onChange={(e) => {
            setTempState(true);
            setRenameValue(e.target.value)
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        onClose={() => {
          setIsFolder(false);
          setShowDeleteModal(false);
        }}
        onConfirm={handleDeleteFile}
        confirmText="Delete"
        loading={loading_general}
      >
        <p className="text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {selectedItem?.split("/")?.pop()}
          </span>
          ?
        </p>
        
      </Modal>

      <AnalysisModal 
        isOpen={showAnalysisModal} 
        onClose={() => setShowAnalysisModal(false)}
        data={analysisData}
        loading={is_analyzing}
      />
    </div>
  )
}
