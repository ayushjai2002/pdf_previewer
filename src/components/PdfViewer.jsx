import React, { useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import PDFPage from './PDFPage';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [droppedTags, setDroppedTags] = useState([]);
  const [activeTagLabel, setActiveTagLabel] = useState('');

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      alert('❌ Please select a valid PDF file.');
      setFileUrl(null);
      return;
    }

    const blobUrl = URL.createObjectURL(selectedFile);
    setFileUrl(blobUrl);
  };

  const handleTagMove = (tagId, newX, newY, pageNumber) => {
    setDroppedTags((prev) =>
      prev.map((tag) =>
        tag.id === tagId && tag.pageNumber === pageNumber
          ? { ...tag, x: newX, y: newY }
          : tag
      )
    );
  };

  const handleTagDrop = (tag) => {
    setDroppedTags((prev) => [...prev, tag]);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSave = () => {
    console.log('✅ Saved Tags:', droppedTags);
    alert('✅ Changes have been saved!');
    // You can also save to backend/localStorage here
    // localStorage.setItem('pdf-tags', JSON.stringify(droppedTags));
  };

  return (
    <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
      <h2>📄 Upload and View PDF</h2>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      
      {fileUrl && (
        <>
          <div style={{ marginTop: '20px' }}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error('Failed to load PDF:', error);
                setFileUrl(null);
              }}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <PDFPage
                  key={i + 1}
                  pageNumber={i + 1}
                  droppedTags={droppedTags.filter((tag) => tag.pageNumber === i + 1)}
                  onTagDrop={handleTagDrop}
                  onTagMove={handleTagMove}
                  activeTagLabel={activeTagLabel}
                />
              ))}
            </Document>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              💾 Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfViewer;
