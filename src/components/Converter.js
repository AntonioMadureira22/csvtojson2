import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Converter = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setJsonData(result.data);
        },
      });
    }
  };

  const handleDownload = () => {
    if (!jsonData) return;
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    saveAs(jsonBlob, "converted.json");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-400">
          CSV to JSON Converter
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-300 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700 cursor-pointer"
        />

        {jsonData && (
          <button
            onClick={handleDownload}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 
                      text-white font-bold py-2 px-4 rounded-lg transition 
                      duration-300"
          >
            Download JSON
          </button>
        )}
      </div>
    </div>
  );
};

export default Converter;