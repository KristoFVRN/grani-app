import React, { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { PersonAvatar } from './PersonAvatar';
import { uploadAvatarImage } from '../utils/imageUpload';

interface AvatarUploaderProps {
  value?: string;
  name: string;
  onChange: (url: string) => void;
  label?: string;
}

/**
 * Avatar preview + file upload/remove controls for student and staff modals.
 */
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  value,
  name,
  onChange,
  label = 'Фотография ученика'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const result = await uploadAvatarImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить фотографию');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3 flex items-center gap-3.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative shrink-0">
        <PersonAvatar
          src={value}
          name={name || 'Ученик'}
          className="w-16 h-16 rounded-2xl ring-2 ring-purple-200 shadow-xs"
          textClassName="text-lg"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div>
          <div className="font-extrabold text-xs text-slate-900">{label}</div>
          <div className="text-[10px] text-slate-500 leading-snug">
            JPG, PNG • фото с телефона или компьютера
          </div>
        </div>

        {error && (
          <div className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#4e1984] hover:bg-[#3d1266] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition disabled:opacity-60"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>{value ? 'Заменить фото' : 'Загрузить фото'}</span>
          </button>

          {value && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                setError(null);
                onChange('');
              }}
              className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Удалить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
