import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  Box,
  CardActions,
} from "@mui/material";
import React, { useEffect } from "react";

export const NumberBlock = (props) => {
  const { difference, positive = false, sx, value, title, icon, colo, task_per_minute } = props;
  const [roundDifference, setRoundDifference] = React.useState(0);
  const titleColor = title.toLowerCase().includes("time") ? "white" : "white";
  const valueTime = title.toLowerCase().includes("time") ? value.toFixed(1) + " Hrs" : value;

  useEffect(() => {
    if (difference) {
      setRoundDifference(difference.toFixed(0));
    }
  }, [difference]);

  return (
    <Card
      sx={{
        ...sx,
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.09)" },
        backgroundColor: colo[400],
      }}
    >
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="h5" style={{ fontWeight: "bold" }}>
              {title}
            </Typography>
            <Typography
              variant="h4"
              color={titleColor}
              fontFamily={"sans-serif"}
              fontWeight={"bolder"}
            >
              {valueTime}
            </Typography>
          </Stack>
          <SvgIcon>{icon}</SvgIcon>
        </Stack>
      </CardContent>
      {roundDifference != "0" && (
        <CardActions sx={{ backgroundColor: colo[100] }}>
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon
                color={positive ? "success" : "error"}
                fontSize="small"
                fontWeight={"bold"}
                sx={{ fontWeight: "bold" }}
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>

              <Typography
                color={positive ? "success" : "error.main"}
                // variant="body2"
              >
                {roundDifference}
              </Typography>
            </Stack>
            <Typography color="black" variant="caption" fontWeight={"bolder"} fontFamily={""}>
              minutes saved
            </Typography>
            {task_per_minute != "0" && (
              <>
                <Typography>|</Typography>
                <Typography color="black" variant="caption" fontWeight={"bolder"} fontFamily={""}>
                  {task_per_minute} minute per task
                </Typography>
              </>
            )}
          </Stack>
        </CardActions>
      )}
    </Card>
  );
};

NumberBlock.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  colo: PropTypes.string.isRequired,
  task_per_minute: PropTypes.string.isRequired,
};
//
// export default NumberBlock;
