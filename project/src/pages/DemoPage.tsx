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
}

const DemoPage = () => {
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [targetColumns, setTargetColumns] = useState<string[]>([]);
  const [samples, setSamples] = useState<SamplesState>({ source: {}, target: {} });
  const [selectedSourceColumn, setSelectedSourceColumn] = useState<string>('');
  const [selectedTargetColumn, setSelectedTargetColumn] = useState<string>('');
  const [code, setCode] = useState<string>('');

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">TabulaX - Data Transformation</h1>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Upload your source and target samples and write transformation logic to test.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6 space-y-6">

         {/* Source and Target Uploaders Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Upload */}
            <div className="p-4 border rounded-lg bg-slate-50">
              <FileUploader
                type="source"
                setColumns={setSourceColumns}
                setSamples={setSamples}
              />
            </div>

          {/* Target Upload */}
          <div className="p-4 border rounded-lg bg-slate-50">
            <FileUploader
              type="target"
              setColumns={setTargetColumns}
              setSamples={setSamples}
            />
          </div>
        </div>


      {(sourceColumns.length > 0 || targetColumns.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Source Selector on left */}
           {sourceColumns.length > 0 && (
            <ColumnSelector
              columns={sourceColumns}
              onSelect={setSelectedSourceColumn}
              label="Select Source Column"
            />
          )}
          
          {/* Target Selector on right */}
          {targetColumns.length > 0 && (
            <ColumnSelector
              columns={targetColumns}
              onSelect={setSelectedTargetColumn}
              label="Select Target Column"
            />
          )}

         
        </div>
      )}


        {(selectedSourceColumn || selectedTargetColumn) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Source Samples on left */}
             {selectedSourceColumn && samples.source?.[selectedSourceColumn]?.length > 0 && (
              <SamplePreview
                samples={samples.source[selectedSourceColumn]}
                title="Source Samples"
              />
            )}

            {/* Target Samples on right */}
            {selectedTargetColumn && samples.target?.[selectedTargetColumn]?.length > 0 && (
              <SamplePreview
                samples={samples.target[selectedTargetColumn]}
                title="Target Samples"
              />
            )}
        
           
          </div>
        )}
        

          {/* Transformation Box */}
          {selectedSourceColumn &&
            selectedTargetColumn &&
            samples.source?.[selectedSourceColumn]?.length > 0 &&
            samples.target?.[selectedTargetColumn]?.length > 0 && (
              <TransformationBox
                samples={samples.source[selectedSourceColumn]}
                targetValues={samples.target[selectedTargetColumn]}
                code={code}
                setCode={setCode}
              />
            )}

          {/* Test Function */}
          {selectedSourceColumn && samples.source?.[selectedSourceColumn]?.length > 0 && (
            <TestFunctionBox
            code={code}
            sampleInput={samples.source?.[selectedSourceColumn]?.[0] || ''}
          />
          

          )}

          {/* Confirm Apply */}
          {selectedSourceColumn && code && (
            
            <ConfirmApply column={selectedSourceColumn} code={code} />
          )}
        </div>

        {/* Instructions Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-blue-500 mr-4 mt-1">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92A1.49 1.49 0 0012 12h-.01v1h-2v-.5a3.5 3.5 0 012.45-3.34l1.1-1.1a1 1 0 10-1.41-1.41l-.54.53-1.42-1.42.54-.54a3 3 0 114.24 4.24z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How to use this demo</h3>
              <ol className="list-decimal space-y-2 pl-5 text-slate-700">
                <li>Upload your source and target samples</li>
                <li>Select one column each from source and target</li>
                <li>Write transformation code to convert source to target</li>
                <li>Test your function on one sample</li>
                <li>Apply and finalize the transformation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
