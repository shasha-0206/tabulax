import React, { useEffect, useState } from "react";
import { ClipboardIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';

interface TransformationBoxProps {
    samples?: string[];
    targetValues?: string[];
    code: string;
    setCode: (code: string) => void;
}

const TransformationBox: React.FC<TransformationBoxProps> = ({
    samples = [],
    targetValues = [],
    code,
    setCode,
}) => {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableCode, setEditableCode] = useState(code);
    const [functionType, setFunctionType] = useState<string | null>(null); // New state for function type

    useEffect(() => {
        if (!samples.length || !targetValues.length) return;

        const fetchFunction = async () => {
            try {
                const response = await fetch("http://localhost:5000/generate-function", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source_values: samples, target_values: targetValues }),
                });

                const data: { pythonFunction?: string; type?: string; error?: string } = await response.json();
                setCode(data.pythonFunction || "Failed to generate function");
                setFunctionType(data.type || null); // Store the type
            } catch (error) {
                console.error("Error fetching function:", error);
                setCode("Error fetching function");
            }
        };

        fetchFunction();
    }, [samples, targetValues, setCode]);

    const handleCopy = async () => {
        if (!code) return;
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setCode(editableCode);
        } else {
            setEditableCode(code);
        }
        setIsEditing(!isEditing);
    };

    const handleEditableCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditableCode(event.target.value);
    };

    return (
        <div className="bg-white text-gray-900 p-4 rounded-2xl relative mt-6 shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_-4px_6px_rgba(0,0,0,0.1),4px_0px_6px_rgba(0,0,0,0.1),-4px_0px_6px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-2 text-teal-500">Generated Transformation Code:</h3>

            {functionType && (
                <p className="text-sm text-purple-600 mb-2 font-medium">
                    Function Type: <span className="font-mono">{functionType}</span>
                </p>
            )}

            {isEditing ? (
                <textarea
                    value={editableCode}
                    onChange={handleEditableCodeChange}
                    className="bg-gray-100 text-gray-900 rounded-xl p-4 overflow-x-auto text-sm font-mono w-full border border-gray-300"
                    rows={6}
                />
            ) : (
                <pre className="bg-gray-100 text-gray-900 rounded-xl p-4 overflow-x-auto text-sm font-mono relative border border-gray-300">
                    {code || "No code generated yet."}
                </pre>
            )}

            <div className="absolute top-4 right-4 flex gap-3 items-center">
                <button
                    onClick={handleEditToggle}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                >
                    <PencilIcon className="w-4 h-4" />
                    {isEditing ? "Save" : "Edit"}
                </button>

                <button
                    onClick={handleCopy}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4 text-green-500" />
                            Copied
                        </>
                    ) : (
                        <>
                            <ClipboardIcon className="w-4 h-4" />
                            Copy
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TransformationBox;
