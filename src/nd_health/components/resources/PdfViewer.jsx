// src/components/PdfViewerEnhanced.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';

const PdfViewer = ({
                             open,
                             onClose,
                             pdfUrl,
                             title = "PDF Document",
                             filename = "document.pdf"
                           }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:480px)');

  useEffect(() => {
    if (open && pdfUrl) {
      loadPdf();
    }
  }, [open, pdfUrl]);

  const loadPdf = async () => {
    setLoading(true);
    setError(null);

    try {
      // Dynamically import PDF.js
      const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setLoading(false);

      // Render first page
      renderPage(pdf, 1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Your latest Lab Result:');
      setLoading(false);
    }
  };

  const renderPage = async (pdf, pageNum) => {
    if (!canvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render PDF page');
    }
  };

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(pdfDoc, currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleFullscreen = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleClose = () => {
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setCurrentPage(1);
    setTotalPages(0);
    onClose();
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        style: {
          height: isMobile ? '100vh' : '95vh',
          maxHeight: isMobile ? '100vh' : '95vh',
          margin: isMobile ? 0 : undefined,
        },
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1,
        flexWrap: isSmallMobile ? 'wrap' : 'nowrap'
      }}>
        <Typography variant={isSmallMobile ? 'h6' : 'h5'} sx={{ flex: 1, minWidth: 0 }}>
          {title} {totalPages > 0 && `(${currentPage}/${totalPages})`}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {/* PDF Controls */}
          {pdfDoc && (
            <>
              <Tooltip title="Previous Page">
                <IconButton onClick={prevPage} disabled={currentPage <= 1} size="small">
                  <NavigateBefore />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next Page">
                <IconButton onClick={nextPage} disabled={currentPage >= totalPages} size="small">
                  <NavigateNext />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton onClick={zoomOut} size="small">
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton onClick={zoomIn} size="small">
                  <ZoomIn />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Action buttons */}
          <Tooltip title="Download">
            <IconButton onClick={handleDownload} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint} size="small">
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in new tab">
            <IconButton onClick={handleFullscreen} size="small">
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 1, position: 'relative', height: '100%', overflow: 'auto' }}>
        {loading && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            gap: 2
          }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading PDF...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="success" sx={{ m: 2 }}>
            {error}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon />}>
                Download
              </Button>
              <Button variant="outlined" onClick={handleFullscreen} startIcon={<FullscreenIcon />}>
                Open in new tab
              </Button>
            </Box>
          </Alert>
        )}

        {/* PDF Canvas */}
        {!loading && !error && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100%',
            p: 1
          }}>
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;