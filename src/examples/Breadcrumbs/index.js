/**
 =========================================================
 * Material Kit 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-kit-pro-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom componentsBreadcrumbs
import { Link } from "react-router-dom";

// @mui material components
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKButton from "../../components/MKButton";

function Breadcrumbs({ routes, ...rest }) {
  return (
    <MKBox bgColor="inreate" borderRadius="md" py={1} px={2}
    >
      <MuiBreadcrumbs {...rest}>
        {routes.map(({ label, route, icon }) =>
          route ? (
            <>
              <MKButton
                key={label}
                component={Link}
                to={route}
                variant="contained"
                color="info"
                fontWeight="regular"
                opacity={0.8}
                sx={{
                  "&:hover, &:focus": {
                    color: ({ palette: { info } }) => info.main,
                  },
                  fontSize:"1rem",
                  padding: "0.8rem",
                  // with:'100%'
                }}

              >
                {icon}&nbsp;&nbsp;{label}
              </MKButton>

            </>
          ) : (
            <MKButton key={label} fontWeight="regular" disabled>
              {icon}&nbsp;&nbsp;{label}
            </MKButton>
          ),
        )}
      </MuiBreadcrumbs>
    </MKBox>
  );
}

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default Breadcrumbs;
