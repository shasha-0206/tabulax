import React, { useEffect } from "react";

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
    useEffect(() => {
        if (!samples.length || !targetValues.length) return;

        console.log("Sending request with:", samples, targetValues);

        const fetchFunction = async () => {
            try {
                const response = await fetch("http://localhost:5000/generate-function", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source_values: samples, target_values: targetValues }),
                });

                const data: { pythonFunction?: string; error?: string } = await response.json();
                console.log("Generated Code:", data.pythonFunction);

                setCode(data.pythonFunction || "Failed to generate function");
            } catch (error) {
                console.error("Error fetching function:", error);
                setCode("Error fetching function");
            }
        };

        fetchFunction();
    }, [samples, targetValues, setCode]);

    return (
        <div>
            <h3>Generated Transformation Code:</h3>
            <pre>{code || "No code generated yet."}</pre>
        </div>
    );
};

export default TransformationBox;
