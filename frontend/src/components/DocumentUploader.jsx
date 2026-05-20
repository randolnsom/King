import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';

function DocumentUploader({ onUpload, disabled }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="uploader-card">
      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload size={48} className="upload-icon" />
        <h3>Upload Your Document</h3>
        <p>Drag & drop or click to select</p>
        <p className="file-types">
          PDF • DOCX • TXT • PNG/JPG • PPTX
        </p>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={disabled}
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.pptx,.ppt"
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          {disabled ? 'Processing...' : 'Select File'}
        </label>
      </div>
      <div className="info-box">
        <AlertCircle size={16} />
        <span>Max file size: 100MB</span>
      </div>
    </div>
  );
}

export default DocumentUploader;
