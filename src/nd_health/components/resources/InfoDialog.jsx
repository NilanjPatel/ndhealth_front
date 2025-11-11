import { format_Date_to_month_date_year } from "./utils";
import IconButton from "@mui/material/IconButton";
import { StatusIcon } from "./resources/StatusIcon";
import { green, red } from "@mui/material/colors";

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";

import Box from "@mui/material/Box";

const InfoDialog = ({ open, onClose, demo }) => {
    const [cachedData, setCachedData] = useState(null);
    const [patientName, setPatientName] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentCode, setPaymentCode] = useState("");
    const [paymentColor, setPaymentColor] = useState("");

    useEffect(() => {
        const cacheKey = `demo_${demo}`;
        const data = localStorage.getItem(cacheKey);
        if (data) {
            const parsedData = JSON.parse(data);
            setCachedData(parsedData);

            const {
                firstName,
                lastName,
                dateOfBirth,
                expiryDate,
                healthNumber,
                responseAction,
                responseCode,
                responseID,
                versionCode,
                rosterStatus,
            } = parsedData.data;

            // Construct patient name based on available fields
            let name = "Health Card Validation Details of Patient";
            if (firstName) name += `: ${firstName}`;
            if (lastName) name += ` ${lastName}`;
            setPatientName(name.trim());
            setPaymentCode(responseCode);

            // Determine payment status
            if (
              responseAction.includes("You will receive payment") ||
              responseAction.includes("maintain his/her future health care coverage")
            ) {
                setPaymentStatus("yes");
                setPaymentColor(green[900]);
            } else if (responseAction.includes("No payment")) {
                setPaymentStatus("no");
                setPaymentColor(red[900]);
            } else {
                setPaymentStatus("not valid");
                setPaymentColor(red[900]);
            }
        }
    }, [demo]);

    if (!cachedData) return null;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md">
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "1rem", position: "relative" }}
          >
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {patientName}
              </Box>
          </DialogTitle>
          <DialogContent>
              <TableContainer component={Paper}>
                  <Table>
                      <TableBody>
                          {cachedData.data.responseAction && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Payment Status:
                                </TableCell>
                                <TableCell
                                  sx={{
                                      width: "21rem",
                                      fontSize: "0.8rem",
                                      color: paymentColor,
                                      fontWeight: "bold",
                                      padding: "4px",
                                  }}
                                >
                                    {cachedData.data.responseAction}
                                    <IconButton>
                                        <StatusIcon
                                          status={paymentStatus}
                                          data={paymentCode}
                                          rosterStatus={cachedData.data.rosterStatus}
                                          fontSize={"12px"}
                                        />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.responseCode && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Response Code:
                                </TableCell>
                                <TableCell
                                  sx={{
                                      color: paymentColor,
                                      fontSize: "0.8rem",
                                      fontWeight: "bold",
                                      padding: "4px",
                                  }}
                                >
                                    {cachedData.data.responseCode}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.responseID && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Roster Status:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {cachedData.data.responseID}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.expiryDate && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Expiry Date:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {format_Date_to_month_date_year(
                                      cachedData.data.expiryDate
                                    )}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.firstName && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    First Name:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {cachedData.data.firstName}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.lastName && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Last Name:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {cachedData.data.lastName}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.dateOfBirth && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Date of Birth:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {format_Date_to_month_date_year(
                                      cachedData.data.dateOfBirth
                                    )}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.healthNumber && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Health Card Number:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {cachedData.data.healthNumber}
                                </TableCell>
                            </TableRow>
                          )}

                          {cachedData.data.versionCode && (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Version Code:
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    {cachedData.data.versionCode}
                                </TableCell>
                            </TableRow>
                          )}

                          {typeof cachedData.data.rosterStatus === "string" ? (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Roster Status:
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.8rem", padding: "4px", color: "green" }}
                                >
                                    {cachedData.data.rosterStatus}
                                </TableCell>
                            </TableRow>
                          ) : cachedData.data.rosterStatus === false ? (
                            <TableRow>
                                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                                    Roster Status:
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.8rem", padding: "4px", color: "red" }}
                                >
                                    Patient is not rostered with our Clinic's doctors.
                                </TableCell>
                            </TableRow>
                          ) : null}
                      </TableBody>
                  </Table>
              </TableContainer>
          </DialogContent>
      </Dialog>
    );
};

export default InfoDialog;
