
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  if (!isOpen && !isAnimatingOut) return null

  const handleCancel = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      onCancel()
    }, 200)
  }

  const handleConfirm = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      onConfirm()
    }, 200)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />

      {/* Dialog */}
      <div
        className={`relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 max-w-sm mx-4 transform transition-all duration-200 ${
          isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex gap-3 mb-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isDangerous ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-100 font-semibold text-lg">{title}</h2>
            <p className="text-slate-400 text-sm mt-1">{description}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              isDangerous ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
