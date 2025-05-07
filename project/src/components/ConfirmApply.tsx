import React, { useState } from "react";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

interface ConfirmApplyProps {
    column: string;
    code: string;
    transformationType: string;
}

interface Row {
    [key: string]: any;
}

const ConfirmApply: React.FC<ConfirmApplyProps> = ({ column, code, transformationType }) => {
    const [updatedRows, setUpdatedRows] = useState<Row[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleApplyTransformation = async () => {
        setLoading(true);
        setError(null);
        setUpdatedRows(null);

        try {
            const response = await fetch("http://localhost:5000/apply_transformation", {
                method: "POST",
                body: JSON.stringify({
                    column_name: column,
                    code,
                    transformation_type: transformationType
                }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (data.error) {
                setError(`Error: ${data.error}`);
            } else {
                setUpdatedRows(data.updated_rows);
            }
        } catch (err) {
            setError("❌ Failed to apply transformation.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 font-sans bg-white rounded-2xl shadow-xl border border-gray-200">
            <button
                onClick={handleApplyTransformation}
                disabled={loading}
                className={`px-6 py-2 rounded transition duration-200 text-white flex items-center gap-2 ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? (
                    <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Applying...
                    </>
                ) : (
                    <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Apply Transformation
                    </>
                )}
            </button>

            {error && <p className="text-red-600 font-medium">{error}</p>}

            <Transition
                show={!!updatedRows}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                {updatedRows && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">✅ Transformed Data:</h3>
                        <div className="overflow-x-auto max-h-[400px] border rounded shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        {Object.keys(updatedRows[0]).map((columnName) => (
                                            <th
                                                key={columnName}
                                                className="px-4 py-2 border-b font-medium text-left text-gray-700"
                                            >
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
                                                <td key={cellIndex} className="px-4 py-2 border-b text-gray-800">
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
            </Transition>
        </div>
    );
};

export default ConfirmApply;
