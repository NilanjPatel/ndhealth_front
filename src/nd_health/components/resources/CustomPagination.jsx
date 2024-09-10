import React, { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PaginationItem from "@mui/material/PaginationItem";

const CustomPagination = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        sx={{ mt: 2 }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            disabled={
              (item.type === "previous" && currentPage === 1) ||
              (item.type === "next" && currentPage === totalPages)
            }
          />
        )}
      />
    </Stack>
  );
};

export default CustomPagination;
