import API_BASE_PATH from "../../../apiConfig";
import React, { useEffect, useState } from "react";

// Import the main component
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

const DisplayPolicy = () => {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/assets/policy/`);
        const data = await response.json();
        setDocument(data);
        console.log(`Data: ${JSON.stringify(data)}`);
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };
    fetchClinicInfo().then(r => {});
  }, []);

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/*<h3>{document.title}</h3>*/}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={document.file} />
      </Worker>
    </div>
  );
};

export default DisplayPolicy;
