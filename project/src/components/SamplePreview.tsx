import React from "react";

interface SamplePreviewProps {
  samples: string[];
  title?: string;
}

const SamplePreview: React.FC<SamplePreviewProps> = ({ samples, title = "Sample Values" }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {samples.length > 0 ? (
        <div className="overflow-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {samples.map((val, index) => (
                <tr key={index} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2 text-gray-700">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">No samples available.</p>
      )}
    </div>
  );
};

export default SamplePreview;
