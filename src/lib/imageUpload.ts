import { validateImageUploadFile } from '../utils/validators';
import { isSupabaseConfigured, uploadImageToSupabaseStorage } from './supabase';

export async function processAndUploadImage(
  file: File,
  folder: 'profiles' | 'projects' | 'gallery' | 'branding',
  maxDimension = 1200
): Promise<string> {
  const validationError = validateImageUploadFile({ type: file.type, size: file.size });
  if (validationError === 'unsupported_file_type') {
    throw new Error('Please upload a JPG, PNG, WebP, or AVIF image.');
  }
  if (validationError === 'file_too_large') {
    throw new Error('Image must be 5 MB or smaller.');
  }

  // If external Supabase Storage is configured, upload directly to the portfolio-media bucket.
  if (isSupabaseConfigured) {
    const publicUrl = await uploadImageToSupabaseStorage(file, folder);
    if (publicUrl) return publicUrl;
  }

  // Compress and resize client-side into an optimized WebP/JPEG data URL under Firestore's 1MB doc budget.
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Browser canvas is unavailable for image processing.');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL('image/webp', 0.82);
  if (dataUrl.length <= 750000) {
    return dataUrl;
  }

  const fallbackJpeg = canvas.toDataURL('image/jpeg', 0.72);
  if (fallbackJpeg.length > 850000) {
    throw new Error('Compressed image is still too large. Please choose a smaller image.');
  }
  return fallbackJpeg;
}
