import React, { useEffect, useState } from "react";

import API_BASE_PATH from "../../../apiConfig";

// Import the main component
import { Viewer } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

import { Worker } from "@react-pdf-viewer/core";

const DisplayPolicy = () => {
  const [documents, setDocuments] = useState([]);


  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/assets/policy/`);
        const data = await response.json();
        setDocuments(data);
        console.log(`Data:${JSON.stringify(data)}`);
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };
    fetchClinicInfo().then(r => {
    });
  }, []);

  return (
    <div>

      {/*<h3>{documents.title}</h3>*/}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={document.file} />

      </Worker>

    </div>
  );
};

export default DisplayPolicy;
