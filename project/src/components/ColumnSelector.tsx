import React from "react";

interface ColumnSelectorProps {
  columns: string[];
  onSelect: (value: string) => void;
  label: string;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, onSelect, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
      >
        <option value="" disabled selected>
          Select a column
        </option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColumnSelector;
