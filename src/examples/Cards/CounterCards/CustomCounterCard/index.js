// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function CustomCounterCard({ name, position, description, displayText }) {
  return (
    <Card sx={{ mt: 3 }}>
      <Grid container>
        <Grid item xs={12} md={6} lg={4} sx={{ mt: -6 }}>
          <MKBox width="100%" pt={2} pb={1} px={2}>
            {displayText && (
              <MKBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="200px"
                borderRadius="md"
                shadow="lg"
                sx={{ backgroundColor: "grey.100" }}
              >
                <MKTypography variant="h2" color="text">
                  {typeof displayText === 'object' ? JSON.stringify(displayText) : displayText}
                </MKTypography>
              </MKBox>
            )}
          </MKBox>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ my: "auto" }}>
          <MKBox pt={{ xs: 1, lg: 2.5 }} pb={2.5} pr={4} pl={{ xs: 4, lg: 1 }} lineHeight={1}>
            <MKTypography variant="h5">{name}</MKTypography>
            <MKTypography variant="h6" color={position.color} mb={1}>
              {position.label}
            </MKTypography>
            <MKTypography variant="body2" color="text">
              {description}
            </MKTypography>
          </MKBox>
        </Grid>
      </Grid>
    </Card>
  );
}

// Typechecking props for the CustomCounterCard
CustomCounterCard.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
    label: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string.isRequired,
  displayText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ])
};

export default CustomCounterCard;