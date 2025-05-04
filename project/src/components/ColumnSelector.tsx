import React from "react";

interface ColumnSelectorProps {
    columns: string[];
    onSelect: (value: string) => void;
    label: string;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, onSelect, label }) => {
    return (
        <div>
            <h3>{label}</h3>
            <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelect(e.target.value)}>
                <option value="">Select a column</option>
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
