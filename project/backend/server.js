require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./config/passport");
const session = require("express-session");

// NEWLY IMPORTED DEPENDENCIES
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const multer = require("multer");
const xlsx = require("xlsx");
const axios = require("axios");
const { spawn } = require("child_process");

const app = express();

// Global variable to store transformation data
global.transformationData = {
  source_values: [],
  target_values: []
};

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));

// DB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => res.send("TabulaX Auth API running"));

// Configure file upload
const upload = multer({ dest: "uploads/" });

// Helper: Convert row data to column format
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

// Helper: Extract function name from code
function extractFunctionName(code) {
    const match = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : null;
}

// In-memory storage for uploaded data (temporary, session-based)
let uploadedSourceData = null;
let uploadedTargetData = null;
let InputData = null;

// Handle source file upload
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

// Handle target file upload
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

// Handle input file upload
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

// Handle function generation based on source and target values
app.post("/generate-function", async (req, res) => {
    try {
        const { source_values, target_values } = req.body;

        // Ensure source_values and target_values are available
        if (!source_values || !target_values) {
            return res.status(400).json({ error: "Source values and target values are required" });
        }

        // Store the source and target values for later use
        // This is important for General transformations
        global.transformationData.source_values = source_values;
        global.transformationData.target_values = target_values;

        console.log("Stored transformation data:", {
            sourceCount: source_values.length,
            targetCount: target_values.length
        });

        // Prepare request data for the classify API
        const requestData = {
            source_list: source_values,
            target_list: target_values,
        };

        // Call the classify API to get the transformation type and generated function code
        const response = await axios.post("https://93c1-35-198-217-78.ngrok-free.app/classify", requestData);

        // Extract the transformation type and function code from the response
        const { transformation_type, function_code } = response.data;

        // Log the response for debugging
        console.log(`Transformation Type: ${transformation_type}`);
        console.log(`Generated Function Code: \n${function_code}`);

        res.json({
            pythonFunction: function_code,
            type: transformation_type,
            isGeneral: transformation_type === "General"
        });

    } catch (error) {
        console.error("Error generating function:", error.response?.data || error.message);
        res.status(500).json({ error: "Error generating function" });
    }
});


app.post("/apply_transformation", async (req, res) => {
  try {
    const { column_name, code, transformation_type, source_values, target_values } = req.body;

    if (!column_name || !code) {
      return res.status(400).json({ error: "Column name and transformation code are required" });
    }

    if (!InputData || !InputData.rawData) {
      return res.status(400).json({ error: "No uploaded data available" });
    }

    // Handle GENERAL TRANSFORMATION
    const isGeneralTransformation =
      transformation_type === "General" ||
      (code && code.includes("General Knowledge Transformation"));

    if (isGeneralTransformation) {
      let relationship = "Unknown";
      if (code) {
        const match = code.match(/Relationship:\s*(.*)/);
        if (match && match[1]) {
          relationship = match[1].trim();
        }
      }

      let source_values_arr = source_values;
      let target_values_arr = target_values;

      if (!source_values_arr || !target_values_arr) {
        if (
          uploadedSourceData?.rawData &&
          uploadedTargetData?.rawData
        ) {
          const sourceCol = Object.keys(uploadedSourceData.rawData[0])[0];
          const targetCol = Object.keys(uploadedTargetData.rawData[0])[0];

          source_values_arr = uploadedSourceData.rawData.map(r => r[sourceCol]);
          target_values_arr = uploadedTargetData.rawData.map(r => r[targetCol]);

          console.log("Using fallback source/target from uploaded data.");
        } else {
          return res.status(400).json({
            error: "Source and target values are required for General transformations",
          });
        }
      }

      const inputColumnValues = InputData.rawData.map(row => row[column_name]);

      try {
        const response = await axios.post("https://93c1-35-198-217-78.ngrok-free.app/apply_general", {
          source_list: source_values_arr,
          target_list: target_values_arr,
          test_sources: inputColumnValues,
        });

        const { transformed_values, relationship: detectedRelationship } = response.data;

        const updatedRows = InputData.rawData.map((row, index) => ({
          ...row,
          [`${column_name}_transformed`]: transformed_values[index] || "N/A",
        }));

        return res.json({
          updated_rows: updatedRows,
          relationship: detectedRelationship || relationship,
        });
      } catch (err) {
        console.error("General transformation error:", err.response?.data || err.message);
        return res.status(500).json({ error: "Error applying general transformation: " + (err.response?.data?.error || err.message) });
      }
    }

    // Handle NON-GENERAL TRANSFORMATION using Python
    const columnData = InputData.rawData.map(row => row[column_name]);
const sanitizedData = columnData.map(item => {
  if (item === null || item === undefined || String(item).trim() === "") {
    return "None";
  }
  const isNumeric = !isNaN(item);
  return isNumeric ? item : `"${String(item).trim()}"`;
});


    const functionName = extractFunctionName(code);
    if (!functionName) {
      return res.status(400).json({ error: "Could not extract function name from code" });
    }

    const wrappedCode = `
import json
import numpy as np

${code}

inputs = [${sanitizedData.join(", ")}]
results = []

for val in inputs:
    try:
        if val is None or val == "None":
            results.append("None")
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
      if (errorOutput && !errorOutput.includes("'NoneType' object has no attribute")) {
        return res.status(500).json({ error: errorOutput.trim() });
      }

      try {
        const transformedValues = JSON.parse(output.trim());
        const updatedRows = InputData.rawData.map((row, index) => ({
          ...row,
          [`${column_name}_transformed`]: transformedValues[index],
        }));

        console.table(updatedRows.slice(0, 5));
        res.json({ updated_rows: updatedRows });
      } catch (err) {
        res.status(500).json({ error: "Error parsing transformation output" });
      }
    });

  } catch (error) {
    console.error("Error applying transformation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
