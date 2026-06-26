import { useState, useRef } from 'react';
import { X, Upload, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { packageApi } from '../../api/services';

interface Props {
  packageId: number;
  packageTitle: string;
  onClose: () => void;
}

export default function ImageUploadModal({ packageId, packageTitle, onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // Preview তৈরি করো
    const newPreviews = selected.map(f => URL.createObjectURL(f));
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setUploading(true);
    try {
      await packageApi.uploadImages(packageId, files);
      toast.success(`${files.length} image(s) uploaded successfully!`);
      onClose();
    } catch {
      toast.error('Upload failed. Check Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="font-bold text-gray-800">Upload Images</h3>
            <p className="text-sm text-gray-400 mt-0.5">{packageTitle}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex
              items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Drop Zone */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl
              p-8 text-center cursor-pointer hover:border-blue-300
              hover:bg-blue-50 transition">
            <Upload size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              Click to select images
            </p>
            <p className="text-gray-400 text-xs mt-1">
              JPG, PNG, WEBP — Multiple allowed
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected ({files.length} images)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {previews.map((preview, i) => (
                  <div key={i}
                    className="relative group rounded-xl overflow-hidden h-24">
                    <img src={preview} alt=""
                      className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5 bg-blue-500
                        text-white text-xs px-1.5 py-0.5 rounded-full
                        flex items-center gap-1">
                        <Star size={10} /> Cover
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6
                        bg-red-500 text-white rounded-full flex items-center
                        justify-center opacity-0 group-hover:opacity-100
                        transition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                First image will be the cover image
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600
                py-2.5 rounded-xl hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl
                hover:bg-blue-700 transition text-sm disabled:opacity-60
                flex items-center justify-center gap-2">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30
                    border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <><Upload size={15} /> Upload {files.length > 0
                  ? `(${files.length})` : ''}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}