// FileDisplay.jsx
import React from 'react';
import NDHealthIncPolicy from '../../NDHealthIncPolicy.pdf'; // Import the PDF file
import {useState} from "react";
// src/PdfViewer.js
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// import samplePDF from './sample.pdf'; // Ensure your PDF file is in the src directory

const DisplayPolicy = () => {
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '16px',
                }}
            >
                <Toolbar />
            </div>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js`}>
                <Viewer fileUrl={NDHealthIncPolicy} plugins={[toolbarPluginInstance]} />
            </Worker>
        </div>
    );
};

export default DisplayPolicy;
