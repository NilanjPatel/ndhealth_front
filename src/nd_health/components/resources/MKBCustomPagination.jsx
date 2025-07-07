// Material Kit 2 React Components
import MKPagination from "components/MKPagination";
// @mui material components
import Icon from "@mui/material/Icon";

function MKBCustomPagination({ totalPages, page, setPage }) {
  const currentPage = page + 1; // Convert 0-based to 1-based

  const handlePageChange = (newPage) => {
    setPage(newPage - 1); // Convert back to 0-based
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Adjust this number as needed

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no pages
  }

  return (
    <MKPagination>
      {/* Previous button */}
      <MKPagination
        item
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
      >
        <Icon>keyboard_arrow_left</Icon>
      </MKPagination>

      {/* Page numbers */}
      {getPageNumbers().map((pageNum) => (
        <MKPagination
          key={pageNum}
          item
          active={pageNum === currentPage}
          onClick={() => handlePageChange(pageNum)}
          style={{ cursor: 'pointer' }}
        >
          {pageNum}
        </MKPagination>
      ))}

      {/* Next button */}
      <MKPagination
        item
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
      >
        <Icon>keyboard_arrow_right</Icon>
      </MKPagination>
    </MKPagination>
  );
}

export default MKBCustomPagination;