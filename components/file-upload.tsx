"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, Check } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number
}

export function FileUpload({ onFileChange, accept = "*", maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFile: File) => {
    setError(null)

    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }

    // Validate file type
    if (accept !== "*" && !selectedFile.type.match(accept.replace("*", ".*"))) {
      setError("Invalid file type")
      return
    }

    setFile(selectedFile)
    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileChange(selectedFile)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
          <p className="text-slate-500 text-sm">Max file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <File className="h-5 w-5 text-emerald-600" />
              <span className="text-slate-800 text-sm font-medium truncate">{file.name}</span>
              {progress === 100 && <Check className="h-4 w-4 text-green-400" />}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-slate-500 text-xs">Uploading... {progress}%</p>
            </div>
          )}

          {progress === 100 && <p className="text-green-400 text-xs">Upload complete</p>}
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
