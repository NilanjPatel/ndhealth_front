import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper, Box, Avatar,
} from "@mui/material";
import { CheckIcon } from "@heroicons/react/16/solid";

// Helper function to format currency
const formatCurrency = (value) => `$${value.toFixed(2)}`;

const BillingBreakdownDataTable = ({ dateBreakdown }) => {
  return (

    <TableContainer component={Paper}>
      <Table>
        {/* Table Header */}
        {/*<TableHead>*/}
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Service Code</TableCell>
            <TableCell>Billing</TableCell>
            <TableCell>Claimed</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Error</TableCell>
            <TableCell>Claim No</TableCell>
            <TableCell>RA Header</TableCell>
          </TableRow>
        {/*</TableHead>*/}

        {/* Table Body */}
        <TableBody>
          {Object.entries(dateBreakdown).map(([date, records]) => (
            <React.Fragment key={date}>
              {/* First row for the date and occurrences */}
              <TableRow>
                <TableCell rowSpan={records.length + 1}>
                  {date}
                </TableCell>
                {/*<TableCell rowSpan={records.length + 1}>*/}
                {/*  <Typography fontWeight="bold">{records.length}</Typography>*/}
                {/*</TableCell>*/}
              </TableRow>

              {/* Rows for each record */}
              {records.map((record, idx) => (
                <TableRow key={idx}>
                  <TableCell>{record.service_code}</TableCell>
                  <TableCell>{record.billing_no}</TableCell>
                  <TableCell>{formatCurrency(record.amountClaim)}</TableCell>
                  <TableCell>{formatCurrency(record.amountPay)}</TableCell>
                  <TableCell>
                    {record.error_code && record.error_code !== "  " ? (
                      // <Typography color="Error"></Typography>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "Error.main", color: "white" }}>
                        {record.error_code}
                      </Avatar>
                    ) : (
                      <Avatar sx={{ width: 30, height: 30, bgcolor: "success.main" }}>
                        <CheckIcon sx={{ color: "white" }} />
                      </Avatar>
                    )}
                  </TableCell>


                  <TableCell>{record.claim_no}</TableCell>
                  <TableCell>{record.raHeader__raHeader_no}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BillingBreakdownDataTable;