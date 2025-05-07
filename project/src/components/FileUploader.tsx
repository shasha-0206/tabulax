import React, { useState } from "react";

type FileType = "source" | "target" | "input";
type SamplesMap = { [key: string]: string[] };

interface FileUploaderProps {
  type: FileType;
  setColumns: (columns: string[]) => void;
  setSamples: React.Dispatch<React.SetStateAction<{ source: SamplesMap; target: SamplesMap; input: SamplesMap }>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ type, setColumns, setSamples }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", type);

    try {
      const response = await fetch(`http://localhost:5000/upload-${type}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setColumns(data.columns);
      setSamples((prev) => ({ ...prev, [type]: data.samples }));
    } catch (error) {
      console.error(`Error uploading ${type} file:`, error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) handleFile(uploadedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload {type.charAt(0).toUpperCase() + type.slice(1)} File
      </label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className={`relative w-full border-2 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
        } rounded-md p-6 text-center transition-colors duration-300`}
      >
        <p className="text-gray-600 text-sm mb-2">
          Drag & drop a CSV/XLSX file here or click to browse
        </p>

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUploader;
