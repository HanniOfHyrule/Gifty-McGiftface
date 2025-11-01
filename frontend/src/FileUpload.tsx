import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { birthdayApi } from './APIService';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setResult(null);

    try {
      const uploadResult = await birthdayApi.uploadCsv(file);
      setResult(uploadResult);
      if (uploadResult.imported > 0) {
        onUploadSuccess();
      }
    } catch (error) {
      setResult({
        message: 'Upload fehlgeschlagen',
        imported: 0,
        errors: ['Fehler beim Upload der Datei'],
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleGenerateSample = async () => {
    try {
      await birthdayApi.generateSampleData();
      onUploadSuccess();
      setResult({ message: 'Beispieldaten erstellt', imported: 3, errors: [] });
    } catch (error) {
      setResult({
        message: 'Fehler beim Erstellen der Beispieldaten',
        imported: 0,
        errors: [],
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${
            dragActive
              ? 'border-blue-400 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div
            className={`
            mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${
              dragActive
                ? 'bg-blue-500 scale-110'
                : 'bg-gray-100 group-hover:bg-blue-500'
            }
          `}>
            <Upload
              size={32}
              className={`transition-colors duration-300 ${
                dragActive
                  ? 'text-white'
                  : 'text-gray-400 group-hover:text-white'
              }`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              CSV-Datei hochladen
            </h3>
            <p className="text-gray-500">
              Ziehe deine CSV-Datei hierher oder klicke zum Auswählen
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Unterstützte Formate: .csv
            </p>
          </div>
        </div>
      </div>

      {/* Sample Data Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateSample}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
          <Sparkles size={20} />
          Beispieldaten erstellen
        </button>
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div>
              <p className="font-medium text-blue-800">
                Datei wird verarbeitet...
              </p>
              <p className="text-sm text-blue-600">
                Dies kann einen Moment dauern
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Result */}
      {result && (
        <div
          className={`
          rounded-xl p-6 border
          ${
            result.imported > 0
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }
        `}>
          <div className="flex items-start gap-4 mb-4">
            {result.imported > 0 ? (
              <CheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <h4
                className={`font-semibold ${
                  result.imported > 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                {result.message}
              </h4>

              {result.imported > 0 && (
                <p className="text-green-700 mt-1">
                  🎉 {result.imported} Geburtstage erfolgreich importiert!
                </p>
              )}
            </div>
          </div>

          {/* Error Details */}
          {result.errors && result.errors.length > 0 && (
            <details className="mt-4">
              <summary
                className={`cursor-pointer font-medium ${
                  result.imported > 0 ? 'text-orange-700' : 'text-red-700'
                }`}>
                {result.errors.length} Warnungen/Fehler anzeigen
              </summary>
              <div className="mt-3 max-h-48 overflow-y-auto">
                <ul className="space-y-1">
                  {result.errors.map((error: string, index: number) => (
                    <li
                      key={index}
                      className={`text-sm p-2 rounded ${
                        result.imported > 0
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
