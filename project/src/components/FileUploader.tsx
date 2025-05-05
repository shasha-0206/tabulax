import React from "react";

type FileType = "source" | "target" | "input";
type SamplesMap = { [key: string]: string[] };

interface FileUploaderProps {
  type: FileType;
  setColumns: (columns: string[]) => void;
  setSamples: React.Dispatch<React.SetStateAction<{ source: SamplesMap; target: SamplesMap; input: SamplesMap }>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ type, setColumns, setSamples }) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload {type.charAt(0).toUpperCase() + type.slice(1)} File
      </label>
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
};

export default FileUploader;
