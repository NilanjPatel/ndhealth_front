import API_BASE_PATH from "../../../apiConfig";
import React, { useEffect, useState } from "react";

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
    fetchClinicInfo();
  }, []);

  if (!document) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <iframe
        src={document.file}
        style={styles.iframe}
        title="Policy Document"
        frameBorder="0"
      />
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh', // Full viewport height
    minHeight: '500px', // Minimum height for small screens
    maxHeight: '100vh',
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '0',
    margin: '0'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block'
  }
};

export default DisplayPolicy;