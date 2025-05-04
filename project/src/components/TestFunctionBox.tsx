import { useState } from "react";
import axios from "axios";

interface Props {
  code: string;                // Python function code
  sampleInput: string;        // Sample input to test on
}

const TestFunctionBox = ({ code, sampleInput }: Props) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestFunction = async () => {
    if (!code || !sampleInput) {
      setError("Both function and sample input are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/test_function`,
        {
          code,
          sample: sampleInput,
        }
      );

      setResult(response.data.result);
    } catch (err: any) {
      console.error("Test Function Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white space-y-4">
      <h3 className="text-lg font-bold">Test Function</h3>
      <p className="text-sm text-gray-600">Sample Input: {sampleInput}</p>
      <button
        onClick={handleTestFunction}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Testing..." : "Run Test"}
      </button>

      {result && (
        <div className="mt-4 p-2 bg-green-100 rounded">
          <strong>Result:</strong> {result}
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default TestFunctionBox;
