export interface CompressedImageResult {
  file: File;
  dataUrl: string;
}

export async function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82,
): Promise<CompressedImageResult> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    const dataUrl = await fileToDataUrl(file);
    return { file, dataUrl };
  }

  return new Promise<CompressedImageResult>((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const src = readerEvent.target?.result as string;
      if (!src) {
        resolve({ file, dataUrl: '' });
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ file, dataUrl: src });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file, dataUrl: src });
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve({ file: compressedFile, dataUrl });
          },
          mimeType,
          quality,
        );
      };
      img.onerror = () => {
        resolve({ file, dataUrl: src });
      };
      img.src = src;
    };
    reader.onerror = () => {
      resolve({ file, dataUrl: '' });
    };
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

