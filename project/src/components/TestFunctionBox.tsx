import { useState } from "react";
import axios from "axios";

interface Props {
  code: string;
}

const TestFunctionBox = ({ code }: Props) => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestFunction = async () => {
    if (!code || userInput.trim() === "") {
      setError("Please enter input and ensure code is available.");
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
          sample: userInput,
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
    <div className="bg-black text-green-200 font-mono rounded-xl p-4 shadow-lg space-y-4 mt-6 min-h-[220px]">
      <h3 className="text-sm text-green-400">🧪 Python Function Tester Console</h3>

      <div className="flex items-center space-x-2">
        <span className="text-green-500">&gt;</span>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter input to test"
          className="bg-black text-green-200 placeholder-green-500 border-b border-green-600 focus:outline-none w-full"
        />
        <button
          onClick={handleTestFunction}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-black font-bold py-1 px-3 rounded text-sm"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {result && (
        <div className="text-green-300 pt-2">
          <p><span className="text-green-500">$</span> Output:</p>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {error && (
        <div className="text-red-400 pt-2">
          <p><span className="text-red-500">!</span> Error:</p>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default TestFunctionBox;
