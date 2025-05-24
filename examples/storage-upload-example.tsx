import React, { useState } from 'react';
import { StorageService } from '../src/ui/src/services/storage-service-v2';

/**
 * Example component showing how to use Storage Service V2
 * for file uploads without webpack configuration issues
 */
export const FileUploadExample: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const storageService = new StorageService();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Upload file with automatic path generation
      const path = `uploads/${Date.now()}_${file.name}`;
      const url = await storageService.uploadFile(file, path);
      
      setUploadedUrl(url);
      console.log('File uploaded successfully:', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-example">
      <h2>File Upload Example</h2>
      
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        accept="image/*"
      />
      
      {uploading && <p>Uploading...</p>}
      
      {uploadedUrl && (
        <div>
          <p>Upload successful!</p>
          <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <p>URL: <code>{uploadedUrl}</code></p>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};
