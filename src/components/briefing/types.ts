/**
 * Tipos compartilhados entre componentes do briefing
 */

import { UploadedFile } from './hooks/useFileUpload';

export interface FormData {
  [key: string]: any;
}

export interface BriefingSectionProps {
  formData: FormData;
  errors: { [key: string]: string };
  uploadedFiles: { [key: string]: UploadedFile[] };
  onUpdate: (field: string, value: any) => void;
  onFileUpload: (fieldName: string, files: FileList | null) => Promise<UploadedFile[]>;
  onRemoveFile?: (fieldName: string, index: number) => void;
}

export interface ValidationErrors {
  [key: string]: string;
}
