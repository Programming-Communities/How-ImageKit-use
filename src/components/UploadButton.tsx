'use client'

import { useState } from 'react';

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      window.location.reload();
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
      {isUploading ? 'Uploading...' : 'Upload Image'}
      <input 
        type="file" 
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
        disabled={isUploading}
      />
    </label>
  );
}