import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesChange: (files: File[]) => void;
  value?: File[];
  className?: string;
  placeholder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = "*/*",
  multiple = false,
  maxFiles = 1,
  maxSize = 5,
  onFilesChange,
  value = [],
  className,
  placeholder = "Clique ou arraste arquivos aqui"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo ${file.name} excede o tamanho máximo de ${maxSize}MB`);
        return false;
      }
      return true;
    });

    const newFiles = multiple 
      ? [...value, ...validFiles].slice(0, maxFiles)
      : validFiles.slice(0, 1);

    onFilesChange(newFiles);
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
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors form-input",
          dragActive ? "border-primary bg-primary-ultra-light" : "border-border hover:border-primary hover:bg-primary-ultra-light"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-4 text-text-light" />
        <p className="text-text-secondary mb-2">{placeholder}</p>
        <p className="text-sm text-text-light">
          {accept === "image/*" ? "PNG, JPG" : "PDF, DOC, DOCX, TXT"} - Máximo {maxSize}MB
          {multiple && ` - Até ${maxFiles} arquivo${maxFiles > 1 ? 's' : ''}`}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-light">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded text-text-light hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};