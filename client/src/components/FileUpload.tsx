import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  progress: number;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function FileUpload({ 
  onFileUpload, 
  isUploading, 
  progress, 
  accept = ".xlsx,.xls",
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string => {
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return "Format de fichier non supporté. Veuillez utiliser un fichier Excel (.xlsx ou .xls).";
    }

    // Check file size
    if (file.size > maxSize) {
      return `Le fichier est trop volumineux. Taille maximum : ${Math.round(maxSize / 1024 / 1024)}MB.`;
    }

    return "";
  };

  const handleFile = (file: File) => {
    setError("");
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && !isUploading) {
      onFileUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary-400 bg-primary-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-slate-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-slate-900">
                Glissez-déposez votre fichier Excel ici
              </p>
              <p className="text-sm text-slate-600">ou</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="mt-2"
              >
                Parcourir les fichiers
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Formats supportés : .xlsx, .xls • Taille max : {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Traitement en cours...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && (
        <Button
          onClick={handleUpload}
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={!!error}
        >
          <Upload className="h-4 w-4 mr-2" />
          Importer le fichier
        </Button>
      )}
    </div>
  );
}
