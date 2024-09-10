import API_BASE_PATH from "../../../apiConfig";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  CardHeader,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../SEO/HelmetComponent";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

const EFormList = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formList, setFormList] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  // const [patientNumber, setPatientNumber] = useState('');
  const [patientNumbers, setPatientNumbers] = useState({});

  useEffect(() => {
    // fetch list of demographics using access token and clinic slug

    const fetchDemographics = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic-forms/`, {
          method: "get",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();

        if (data.detail === "Invalid token.") {
          navigate("/");
        }

        if (data.length > 0) {
          setFormList(data);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDemographics();
  }, []);

  const handlePatientNumberChange = (rowId, value) => {
    setPatientNumbers((prevState) => {
      const updatedState = { ...prevState, [rowId]: value };
      return updatedState;
    });
  };

  const clearPatientNumber = (rowId) => {
    setPatientNumbers((prevState) => {
      const updatedState = { ...prevState };
      delete updatedState[rowId];
      return updatedState;
    });
  };

  const handleSubmit = (rowId) => {
    // Submit form with patient number
    const patientNumber = patientNumbers[rowId];

    // Add your logic to submit the form with the patient number

    const accessToken = localStorage.getItem("accessToken");

    const assignEform = async () => {
      const response = await fetch(`${API_BASE_PATH}/assign/eform/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
        body: JSON.stringify({
          profile: patientNumber,
          id: rowId,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Eform is Assigned to Patient!");
        // window.location.reload();
        // setPatientNumber('');
        // Clear the patientNumber for the current row
        clearPatientNumber(rowId);
      } else {
        alert("Error assiging Eform!");
      }
    };

    if (patientNumber !== "") {
      assignEform();
    } else {
      alert("Please write Demographic Number to asign eform.");
    }
  };

  return (
    <div>
      {(() => {
        if (isDataLoaded) {
          return [
            <div>
              <HelmetComponent />
              <Card style={{ width: "100%" }}>
                <CardHeader title="Assign Forms to Demographic" />
                <CardContent sx={{ overflowX: "scroll" }}>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                    style={{ width: "100%" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Name </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                          {/* <TableCell style={{ fontWeight: 'bold' }}>Id</TableCell> */}
                          <TableCell style={{ fontWeight: "bold" }}>Assign to</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formList.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.form.title}</TableCell>
                            <TableCell>{row.form.description}</TableCell>
                            {/* <TableCell>{row.id}</TableCell> */}
                            <TableCell>
                              <TextField
                                label="Patient Demographic No."
                                variant="outlined"
                                value={patientNumbers[row.id] || ""}
                                onChange={(event) =>
                                  handlePatientNumberChange(row.id, event.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSubmit(row.id)}
                              >
                                Submit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </div>,
          ];
        } else {
          return (
            <div>
              <Card>
                <CardHeader title="No new eform requests." />
              </Card>
            </div>
          );
        }
      })()}
    </div>
  );
};

export default EFormList;
