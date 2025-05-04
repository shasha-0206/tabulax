import React from "react";

interface SamplePreviewProps {
    samples: string[];
    title?: string;
}

const SamplePreview: React.FC<SamplePreviewProps> = ({ samples, title = "Sample Values" }) => {
    return (
        <div style={{ margin: "20px auto", width: "80%", textAlign: "left" }}>
            <h3 style={{ marginBottom: "10px" }}>{title}</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px", backgroundColor: "#f8f8f8" }}>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {samples.map((val, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{val}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SamplePreview;
