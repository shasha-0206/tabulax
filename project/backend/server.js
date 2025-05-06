require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./config/passport");
const session = require("express-session");

// NEWLY IMPORTED DEPENDENCIES (from second file)
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const multer = require("multer");
const xlsx = require("xlsx");
const axios = require("axios");
const { spawn } = require("child_process");

const app = express();

// Middleware from first file
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes from first file
app.use("/auth", require("./routes/auth"));

// DB connection from first file
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Root route from first file
app.get("/", (req, res) => res.send("TabulaX Auth API running"));

// Configure file upload (from second file)
const upload = multer({ dest: "uploads/" });

// 🔹 Helper: Convert row data to column format
function convertToColumnFormat(dataArray, columns) {
    let formattedData = {};
    columns.forEach((col) => (formattedData[col] = []));
    dataArray.forEach((row) => {
        columns.forEach((col) => {
            formattedData[col].push(row[col] || null);
        });
    });
    return formattedData;
}

// 🔹 Helper: Extract function name from code
function extractFunctionName(code) {
    const match = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : null;
}

// 🔹 In-memory storage for uploaded data (temporary, session-based)
let uploadedSourceData = null;
let uploadedTargetData = null;
let InputData = null;

// 🔹 Routes

// Handle source file upload (from second file)
app.post("/upload-source", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { fileType } = req.body;
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    try {
        let columns = [];
        let rawData = [];

        if (fileExt === "csv") {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsed = Papa.parse(fileContent, { header: true });
            columns = parsed.meta.fields;
            rawData = parsed.data;
        } else if (fileExt === "xlsx") {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            columns = jsonData[0];
            rawData = jsonData.slice(1).map((row) => {
                let obj = {};
                columns.forEach((col, idx) => (obj[col] = row[idx]));
                return obj;
            });
        } else {
            return res.status(400).json({ error: "Unsupported file format" });
        }

        // Store uploaded data in memory
        uploadedSourceData = { columns, rawData };
        const samples = convertToColumnFormat(rawData.slice(0, 5), columns);
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ columns, samples });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Handle target file upload (from second file)
app.post("/upload-target", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { fileType } = req.body;
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    try {
        let columns = [];
        let rawData = [];

        if (fileExt === "csv") {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsed = Papa.parse(fileContent, { header: true });
            columns = parsed.meta.fields;
            rawData = parsed.data;
        } else if (fileExt === "xlsx") {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            columns = jsonData[0];
            rawData = jsonData.slice(1).map((row) => {
                let obj = {};
                columns.forEach((col, idx) => (obj[col] = row[idx]));
                return obj;
            });
        } else {
            return res.status(400).json({ error: "Unsupported file format" });
        }

        // Store uploaded data in memory
        uploadedTargetData = { columns, rawData };
        const samples = convertToColumnFormat(rawData.slice(0, 5), columns);
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ columns, samples });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Handle input file upload (from second file)
app.post("/upload-input", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { fileType } = req.body;
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    try {
        let columns = [];
        let rawData = [];

        if (fileExt === "csv") {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsed = Papa.parse(fileContent, { header: true });
            columns = parsed.meta.fields;
            rawData = parsed.data;
        } else if (fileExt === "xlsx") {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            columns = jsonData[0];
            rawData = jsonData.slice(1).map((row) => {
                let obj = {};
                columns.forEach((col, idx) => (obj[col] = row[idx]));
                return obj;
            });
        } else {
            return res.status(400).json({ error: "Unsupported file format" });
        }

        // Store uploaded data in memory
        InputData = { columns, rawData };
        const samples = convertToColumnFormat(rawData.slice(0, 5), columns);
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ columns, samples });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Handle function generation based on source and target values (from second file)
app.post("/generate-function", async (req, res) => {
    try {
        const { source_values, target_values } = req.body;

        // Ensure source_values and target_values are available
        if (!source_values || !target_values) {
            return res.status(400).json({ error: "Source values and target values are required" });
        }

        // Prepare request data for the classify API
        const requestData = {
            source_list: source_values,
            target_list: target_values,
        };

        // Call the classify API to get the transformation type and generated function code
        const response = await axios.post("http://095d-34-16-244-162.ngrok-free.app/classify", requestData);

        // Extract the transformation type and function code from the response
        const { transformation_type, function_code } = response.data;

        // Log the response for debugging
        console.log(`Transformation Type: ${transformation_type}`);
        console.log(`Generated Function Code: \n${function_code}`);

        // Send the transformation type and function code back to the client

        // const test = [
        //     "def transform(input_str):",
        //     "   num = int(input_str)",
        //     "   output = round((num - 32) * 5 / 9, 2)",
        //     "   return output",
        //   ].join("\n");
          

        
        res.json({
            pythonFunction: function_code,
            type : transformation_type,
        });

    } catch (error) {
        console.error("Error generating function:", error.response?.data || error.message);
        res.status(500).json({ error: "Error generating function" });
    }
});

// 🔹 Test function on one value (from second file)
app.post("/test_function", (req, res) => {
    try {
        const { code, sample } = req.body;
        if (code == null || sample == null) {
            return res.status(400).json({ error: "Code and sample value are required" });
        }

        const functionName = extractFunctionName(code);
        if (!functionName) return res.status(400).json({ error: "Could not extract function name" });

        const isNumerical = !isNaN(sample);
        const sanitizedSample = isNumerical ? parseFloat(sample) : `"${String(sample)}"`;

        const wrappedCode = `
import json
import numpy as np
import logging

# User function
${code}

# Sample input
sample_input = ${sanitizedSample}

# Function application logic
def apply_function_to_input(func, value, is_numerical=${isNumerical ? "True" : "False"}):

    try:
        if is_numerical:
            value = float(value)
        result = func(value)
        if is_numerical and np.isnan(result):
            return "NaN"
        return str(result)
    except Exception as e:
        return f"Error: {e}"

func = ${functionName}
output = apply_function_to_input(func, sample_input, is_numerical=${isNumerical ? "True" : "False"})
print(json.dumps(output))
        `;

        const pythonProcess = spawn("python", ["-c", wrappedCode]);

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on("close", () => {
            if (errorOutput) return res.status(500).json({ error: errorOutput.trim() });

            try {
                const result = JSON.parse(output.trim());
                res.json({ result });
            } catch (parseErr) {
                res.status(500).json({ error: "Error parsing result output" });
            }
        });
    } catch (error) {
        console.error("Error testing function:", error);
        res.status(500).json({ error: "Error testing function" });
    }
});

// 🔹 Apply transformation to column (from second file)
app.post("/apply_transformation", (req, res) => {
    try {
      const { column_name, code } = req.body;
      console.log(column_name)
      if (!column_name || !code) {
        return res.status(400).json({ error: "Column name and transformation code are required" });
      }
  
      if (!InputData || !InputData.rawData) {
        return res.status(400).json({ error: "No uploaded data available" });
      }
  
      const columnData = InputData.rawData.map((row) => row[column_name]);
      const sanitizedData = columnData.map((item) => {
        const value = String(item).trim();
        return value === "" ? null : `"${value}"`;
      });
      
  
      const functionName = extractFunctionName(code);
      if (!functionName) {
        return res.status(400).json({ error: "Could not extract function name" });
      }
  
      // Python code to run for the full column
      const wrappedCode = `
import json
import numpy as np

${code}

inputs = [${sanitizedData.join(", ")}]
results = []

for val in inputs:
    try:
        if val is None or val == "None":
            results.append("None")  # Or use "Skipped" if you prefer
            continue

        out = ${functionName}(val)
        if isinstance(out, float) and np.isnan(out):
            results.append("NaN")
        else:
            results.append(str(out))
    except Exception as e:
        results.append(f"Error: {e}")

print(json.dumps(results))
`.trim();

  
      const pythonProcess = spawn("python", ["-c", wrappedCode]);
  
      let output = "";
      let errorOutput = "";
  
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });
  
      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
  
      pythonProcess.on("close", () => {
        if (errorOutput && !errorOutput.includes("'NoneType' object has no attribute 'split'")) {
            return res.status(500).json({ error: errorOutput.trim() });
          }
          
  
        try {
          const transformedValues = JSON.parse(output.trim());
          const updatedRows = InputData.rawData.map((row, index) => ({
            ...row,
            [`${column_name}_transformed`]: transformedValues[index],
          }));
  
          console.table(updatedRows.slice(0, 5)); // debug preview
          res.json({ updated_rows: updatedRows });
        } catch (err) {
          res.status(500).json({ error: "Error parsing transformation output" });
        }
      });
    } catch (error) {
      console.error("Error applying transformation:", error);
      res.status(500).json({ error: "Error applying transformation" });
    }
  });
  


// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
