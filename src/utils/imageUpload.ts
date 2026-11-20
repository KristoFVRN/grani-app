import { uploadSchoolPhoto } from '../api/syncApi';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Не удалось прочитать файл'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    img.src = src;
  });
}

/**
 * Resize and compress an uploaded image into a compact JPEG for avatars.
 */
export async function compressImageForAvatar(
  file: File,
  maxSize = 480,
  quality = 0.82
): Promise<{ file: File; dataUrl: string }> {
  const originalDataUrl = await readFileAsDataUrl(file);

  try {
    const img = await loadImage(originalDataUrl);
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;

    if (!origW || !origH) {
      return { file, dataUrl: originalDataUrl };
    }

    const scale = Math.min(1, maxSize / Math.max(origW, origH));
    const targetW = Math.max(1, Math.round(origW * scale));
    const targetH = Math.max(1, Math.round(origH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, dataUrl: originalDataUrl };
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    const compressedBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
    );

    if (!compressedBlob) {
      return { file, dataUrl: compressedDataUrl };
    }

    const compressedFile = new File([compressedBlob], 'avatar.jpg', {
      type: 'image/jpeg'
    });

    return {
      file: compressedFile,
      dataUrl: compressedDataUrl
    };
  } catch {
    return { file, dataUrl: originalDataUrl };
  }
}

/**
 * Validate, compress, and upload an avatar photo to server (with local data URL fallback).
 */
export async function uploadAvatarImage(
  file: File
): Promise<{ url: string; storedRemotely: boolean }> {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Пожалуйста, выберите файл изображения (JPG, PNG, WebP)');
  }

  const compressed = await compressImageForAvatar(file);
  const uploadedUrl = await uploadSchoolPhoto(compressed.file);

  if (uploadedUrl) {
    return { url: uploadedUrl, storedRemotely: true };
  }

  return { url: compressed.dataUrl, storedRemotely: false };
}
