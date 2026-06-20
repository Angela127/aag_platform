import { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { extractTextFromPdf } from '../utils/pdfTextExtractor.js';

export default function QuestionnaireUpload({ onExtractionStart, onExtractionSuccess, onExtractionError, isExtracting }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      const errMsg = 'Invalid file type. Please select a PDF file.';
      setError(errMsg);
      onExtractionError(errMsg);
      return;
    }

    setError('');
    setFileName(file.name);
    onExtractionStart();

    try {
      console.log(`Starting client-side text extraction from PDF: ${file.name}`);
      const rawText = await extractTextFromPdf(file);
      console.log(`Successfully extracted ${rawText.length} characters.`);
      onExtractionSuccess(rawText, file.name);
    } catch (err) {
      console.error("PDF Extraction failed:", err);
      const errMsg = 'Failed to extract text from PDF. Please ensure the file is not password-protected.';
      setError(errMsg);
      onExtractionError(errMsg);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  if (isExtracting) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-white min-h-[200px] text-center animate-fade-in flex-grow">
        <Loader2 size={32} className="text-aag-primary animate-spin mb-2" />
        <h4 className="text-xs font-semibold text-gray-800">Extracting questionnaire data...</h4>
        <p className="text-[0.65rem] text-gray-400 mt-0.5 max-w-xs">
          Reading file content and preparing structured fields using client-side AI parsing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center flex-grow h-full w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center flex-grow ${
          dragActive
            ? 'border-aag-primary bg-aag-accent/10'
            : 'border-gray-200 hover:border-aag-primary/45 hover:bg-gray-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
        />

        <div className="p-2 bg-red-50 rounded-full text-aag-primary mb-2 shadow-sm shrink-0">
          <UploadCloud size={18} />
        </div>

        <h4 className="text-xs font-bold text-gray-900 mb-0.5">No questionnaire uploaded yet</h4>
        <p className="text-[0.65rem] text-gray-500 max-w-sm mb-2.5 leading-relaxed">
          Upload the client's completed fact-find PDF to auto-fill their profile snapshot.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-aag-primary hover:bg-aag-primary-dark text-white rounded-lg text-[0.65rem] font-semibold transition-all shadow-sm cursor-pointer"
        >
          <FileText size={12} />
          Select PDF Fact-Find
        </button>

        {fileName && !error && (
          <p className="text-[0.65rem] text-gray-500 mt-2 font-medium">
            Selected: <span className="text-aag-primary">{fileName}</span>
          </p>
        )}

        {error && (
          <div className="flex items-center gap-1 text-[0.65rem] text-red-600 mt-2 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

QuestionnaireUpload.propTypes = {
  onExtractionStart: PropTypes.func.isRequired,
  onExtractionSuccess: PropTypes.func.isRequired,
  onExtractionError: PropTypes.func.isRequired,
  isExtracting: PropTypes.bool.isRequired
};
