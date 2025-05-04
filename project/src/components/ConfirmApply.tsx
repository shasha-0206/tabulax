import React, { useState } from "react";

interface ConfirmApplyProps {
    column: string;
    code: string;
}

interface Row {
    [key: string]: any;
}

const ConfirmApply: React.FC<ConfirmApplyProps> = ({ column, code }) => {
    const [updatedRows, setUpdatedRows] = useState<Row[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApplyTransformation = async () => {
        try {
            const response = await fetch("http://localhost:5000/apply_transformation", {
                method: "POST",
                body: JSON.stringify({ column_name: column, code }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.error) {
                setError(`Error: ${data.error}`);
            } else {
                setUpdatedRows(data.updated_rows);
            }
        } catch (err) {
            setError("Failed to apply transformation.");
            console.error("Fetch error:", err);
        }
    };

    return (
        <div className="p-6 font-sans">
            <button
                onClick={handleApplyTransformation}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 mb-6"
            >
                Apply Transformation
            </button>

            {error && (
                <p className="text-red-600 font-medium mb-4">{error}</p>
            )}

            {updatedRows && (
                <div>
                    <h3 className="text-xl font-semibold mb-3">Transformed Data:</h3>
                    <div className="overflow-x-auto max-h-[400px] border rounded shadow">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    {Object.keys(updatedRows[0]).map((columnName) => (
                                        <th key={columnName} className="px-4 py-2 border-b font-medium text-left">
                                            {columnName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {updatedRows.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        {Object.values(row).map((value, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-2 border-b">
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmApply;
