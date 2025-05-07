import { useState } from 'react';
import ColumnSelector from '../components/ColumnSelector';
import SamplePreview from '../components/SamplePreview';
import TransformationBox from '../components/TransformationBox';
import TestFunctionBox from '../components/TestFunctionBox';
import ConfirmApply from '../components/ConfirmApply';
import FileUploader from '../components/FileUploader';

type SamplesMap = Record<string, string[]>;

interface SamplesState {
  source: SamplesMap;
  target: SamplesMap;
  input: SamplesMap; 
}

const DemoPage = () => {
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [targetColumns, setTargetColumns] = useState<string[]>([]);
  const [inputColumns, setInputColumns] = useState<string[]>([]);

  const [samples, setSamples] = useState<SamplesState>({ source: {}, target: {}, input: {} });
  const [selectedSourceColumn, setSelectedSourceColumn] = useState<string>('');
  const [selectedTargetColumn, setSelectedTargetColumn] = useState<string>('');
  const [selectedInputColumn, setSelectedInputColumn] = useState<string>('');

  const [code, setCode] = useState<string>('');
  const [transformationType, setTransformationType] = useState<string>('');

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="container-custom max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">TabulaX - Data Transformation</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Upload your source and target files. Write your logic. Then test it on an input!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 p-8 space-y-8 border border-slate-200">

          {/* File Uploaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-xl bg-slate-50 shadow-inner">
              <FileUploader type="source" setColumns={setSourceColumns} setSamples={setSamples} />
            </div>
            <div className="p-6 border rounded-xl bg-slate-50 shadow-inner">
              <FileUploader type="target" setColumns={setTargetColumns} setSamples={setSamples} />
            </div>
          </div>

          {/* Column Selectors */}
          {(sourceColumns.length > 0 || targetColumns.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sourceColumns.length > 0 && (
                <ColumnSelector
                  columns={sourceColumns}
                  onSelect={setSelectedSourceColumn}
                  label="Select Source Column"
                />
              )}
              {targetColumns.length > 0 && (
                <ColumnSelector
                  columns={targetColumns}
                  onSelect={setSelectedTargetColumn}
                  label="Select Target Column"
                />
              )}
            </div>
          )}

          {/* Sample Previews */}
          {(selectedSourceColumn || selectedTargetColumn) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedSourceColumn && samples.source?.[selectedSourceColumn]?.length > 0 && (
                <SamplePreview
                  samples={samples.source[selectedSourceColumn]}
                  title="Source Samples"
                />
              )}
              {selectedTargetColumn && samples.target?.[selectedTargetColumn]?.length > 0 && (
                <SamplePreview
                  samples={samples.target[selectedTargetColumn]}
                  title="Target Samples"
                />
              )}
            </div>
          )}

          {/* Transformation Code Box */}
          {selectedSourceColumn &&
            selectedTargetColumn &&
            samples.source?.[selectedSourceColumn]?.length > 0 &&
            samples.target?.[selectedTargetColumn]?.length > 0 && (
              <TransformationBox
                samples={samples.source[selectedSourceColumn]}
                targetValues={samples.target[selectedTargetColumn]}
                code={code}
                setCode={setCode}
                onTransformationTypeChange={setTransformationType}
              />
          )}

          {/* Additional Steps */}
          {code && (
            <>
              {selectedSourceColumn && samples.source?.[selectedSourceColumn]?.length > 0 && (
                <TestFunctionBox
                  code={code}
                />
              )}

              <div className="p-6 border rounded-xl bg-slate-50 shadow-inner">
                <FileUploader type="input" setColumns={setInputColumns} setSamples={setSamples} />
              </div>

              {inputColumns.length > 0 && (
                <ColumnSelector
                  columns={inputColumns}
                  onSelect={setSelectedInputColumn}
                  label="Select Input Column"
                />
              )}

              {selectedInputColumn && samples.input?.[selectedInputColumn]?.length > 0 && (
                <SamplePreview
                  samples={samples.input[selectedInputColumn]}
                  title="Input Samples"
                />
              )}

              {selectedInputColumn && code && (
                <ConfirmApply 
                  column={selectedInputColumn} 
                  code={code} 
                  transformationType={transformationType}
                />
              )}
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="text-blue-500 mt-1">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92A1.49 1.49 0 0012 12h-.01v1h-2v-.5a3.5 3.5 0 012.45-3.34l1.1-1.1a1 1 0 10-1.41-1.41l-.54.53-1.42-1.42.54-.54a3 3 0 114.24 4.24z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How to use this demo</h3>
              <ol className="list-decimal space-y-2 pl-5 text-slate-700">
                <li>Upload your source and target samples</li>
                <li>Select one column each from source and target</li>
                <li>Write transformation code</li>
                <li>Upload the file you want to transform</li>
                <li>Select input column</li>
                <li>Test and apply the transformation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
