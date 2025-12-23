import { useState } from 'react';
import { compressImage } from '@/utils/imageCompression';

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: UploadedFile[]}>({});

  const handleFileUpload = async (fieldName: string, files: FileList | null): Promise<UploadedFile[]> => {
    if (!files) return [];

    const fileArray: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const compressedDataUrl = await compressImage(file);

        fileArray.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: compressedDataUrl
        });
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
      }
    }

    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: fileArray
    }));

    return fileArray;
  };

  const removeFile = (fieldName: string, index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, i) => i !== index) || []
    }));
  };

  const getFiles = (fieldName: string): UploadedFile[] => {
    return uploadedFiles[fieldName] || [];
  };

  return {
    uploadedFiles,
    handleFileUpload,
    removeFile,
    getFiles,
    setUploadedFiles
  };
};
