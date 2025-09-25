export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    maxSizeMB = 1
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Check size and reduce quality if needed
      const sizeInMB = (compressedDataUrl.length * 0.75) / (1024 * 1024);
      
      if (sizeInMB > maxSizeMB && quality > 0.3) {
        // Recursively reduce quality
        const newQuality = Math.max(0.3, quality - 0.1);
        compressImage(file, { ...options, quality: newQuality })
          .then(resolve)
          .catch(reject);
        return;
      }
      
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const getPayloadSize = (data: any): number => {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};