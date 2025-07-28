import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import {
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";

// Animation keyframes
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

// Size configurations
const sizeConfigs = {
  extrasmall: {
    cardPadding: 1,
    iconSize: 32,
    iconWrapper: 40,
    titleFont: '0.625rem',
    valueFont: '1rem',
    chipHeight: 20,
    chipFont: '0.625rem',
    captionFont: '0.6rem',
    borderRadius: 1,
    spacing: 0.5,
    contentSpacing: 1,
  },
  small: {
    cardPadding: 1.5,
    iconSize: 40,
    iconWrapper: 48,
    titleFont: '0.75rem',
    valueFont: '1.5rem',
    chipHeight: 24,
    chipFont: '0.7rem',
    captionFont: '0.65rem',
    borderRadius: 1.5,
    spacing: 1,
    contentSpacing: 1.5,
  },
  medium: {
    cardPadding: 2,
    iconSize: 48,
    iconWrapper: 56,
    titleFont: '0.875rem',
    valueFont: '2rem',
    chipHeight: 28,
    chipFont: '0.75rem',
    captionFont: '0.7rem',
    borderRadius: 2,
    spacing: 1.5,
    contentSpacing: 2,
  },
  large: {
    cardPadding: 3,
    iconSize: 56,
    iconWrapper: 64,
    titleFont: '1rem',
    valueFont: '2.5rem',
    chipHeight: 32,
    chipFont: '0.875rem',
    captionFont: '0.75rem',
    borderRadius: 2.5,
    spacing: 2,
    contentSpacing: 2.5,
  },
};

// Enhanced styled components
const StyledCard = styled(Card)(({ theme, cardcolor, size, loading }) => {
  const config = sizeConfigs[size];
  return {
    borderRadius: theme.spacing(config.borderRadius),
    boxShadow: loading
      ? '0 2px 8px rgba(0, 0, 0, 0.04)'
      : '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    background: loading
      ? theme.palette.grey[100]
      : `linear-gradient(135deg, ${cardcolor[50]} 0%, ${cardcolor[100]} 50%, ${cardcolor[50]} 100%)`,
    border: `1px solid ${loading ? theme.palette.grey[200] : alpha(cardcolor[200], 0.3)}`,
    position: 'relative',
    overflow: 'hidden',
    cursor: loading ? 'default' : 'pointer',

    // Top accent bar
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: size === 'extrasmall' ? '2px' : size === 'small' ? '3px' : '4px',
      background: loading
        ? theme.palette.grey[300]
        : `linear-gradient(90deg, ${cardcolor[400]} 0%, ${cardcolor[600]} 50%, ${cardcolor[500]} 100%)`,
      animation: loading ? `${shimmer} 2s infinite` : 'none',
    },

    // Shimmer effect for loading
    '&::after': loading ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.4)}, transparent)`,
      animation: `${shimmer} 2s infinite`,
    } : {},

    '&:hover': loading ? {} : {
      transform: `translateY(-${size === 'extrasmall' ? '2px' : size === 'small' ? '3px' : '4px'})`,
      boxShadow: `0 8px 30px ${alpha(cardcolor[500], 0.25)}`,
      '& .metric-icon': {
        transform: 'scale(1.1) rotate(5deg)',
        animation: `${float} 2s ease-in-out infinite`,
      },
      '& .metric-value': {
        color: cardcolor[700],
        animation: `${pulse} 1.5s ease-in-out infinite`,
      },
      '& .accent-glow': {
        opacity: 1,
      }
    },

    '&:active': loading ? {} : {
      transform: `translateY(-${size === 'extrasmall' ? '1px' : size === 'small' ? '1px' : '2px'})`,
    },
  };
});

const IconWrapper = styled(Box)(({ theme, cardcolor, size, loading }) => {
  const config = sizeConfigs[size];
  return {
    width: config.iconWrapper,
    height: config.iconWrapper,
    borderRadius: theme.spacing(config.borderRadius * 0.75),
    background: loading
      ? theme.palette.grey[200]
      : `linear-gradient(135deg, ${cardcolor[200]} 0%, ${cardcolor[300]} 50%, ${cardcolor[400]} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: loading
      ? 'none'
      : `0 4px 12px ${alpha(cardcolor[400], 0.3)}`,
    position: 'relative',

    // Accent glow effect
    '&::before': loading ? {} : {
      content: '""',
      position: 'absolute',
      inset: -2,
      borderRadius: 'inherit',
      background: `linear-gradient(135deg, ${cardcolor[300]}, ${cardcolor[500]})`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
      zIndex: -1,
      className: 'accent-glow',
    },
  };
});

const MetricValue = styled(Typography)(({ theme, size, loading }) => {
  const config = sizeConfigs[size];
  return {
    fontWeight: 700,
    fontSize: config.valueFont,
    lineHeight: 1.2,
    background: loading
      ? 'none'
      : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #2a2a2a 100%)',
    WebkitBackgroundClip: loading ? 'initial' : 'text',
    WebkitTextFillColor: loading ? 'transparent' : 'transparent',
    backgroundClip: loading ? 'initial' : 'text',
    transition: 'all 0.3s ease',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    [theme.breakpoints.down('sm')]: {
      fontSize: size === 'large' ? '2rem' :
        size === 'medium' ? '1.5rem' :
          size === 'small' ? '1.25rem' : '1rem',
    },
  };
});

const StyledChip = styled(Chip)(({ theme, positive, cardcolor, size }) => {
  const config = sizeConfigs[size];
  return {
    borderRadius: theme.spacing(config.borderRadius * 0.5),
    fontWeight: 600,
    fontSize: config.chipFont,
    height: config.chipHeight,
    backgroundColor: positive
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.error.main, 0.1),
    color: positive ? theme.palette.success.dark : theme.palette.error.dark,
    border: `1px solid ${positive
      ? alpha(theme.palette.success.main, 0.3)
      : alpha(theme.palette.error.main, 0.3)}`,
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: positive
        ? alpha(theme.palette.success.main, 0.15)
        : alpha(theme.palette.error.main, 0.15),
      transform: 'scale(1.05)',
    },

    '& .MuiChip-icon': {
      fontSize: config.iconSize * 0.5,
      marginLeft: theme.spacing(0.25),
      transition: 'transform 0.2s ease',
    },

    '& .MuiChip-label': {
      fontWeight: 600,
    },
  };
});

const TitleTypography = styled(Typography)(({ size }) => {
  const config = sizeConfigs[size];
  return {
    fontSize: config.titleFont,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.85,
    color: 'text.secondary',
    transition: 'all 0.3s ease',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  };
});

const CaptionTypography = styled(Typography)(({ size }) => {
  const config = sizeConfigs[size];
  return {
    fontSize: config.captionFont,
    fontWeight: 500,
    color: 'text.secondary',
    opacity: 0.8,
    transition: 'all 0.3s ease',
  };
});

export const NumberBlock = (props) => {
  const {
    difference,
    positive = true,
    sx,
    value,
    title,
    icon,
    colo,
    task_per_minute = "0",
    size = "medium",
    loading = false,
    animated = true,
    showDivider = true,
    customLabel,
    onClick,
  } = props;

  const theme = useTheme();
  const [roundDifference, setRoundDifference] = useState(0);
  const [displayValue, setDisplayValue] = useState("");
  const config = sizeConfigs[size];

  const isTimeMetric = title.toLowerCase().includes("time");

  useEffect(() => {
    if (loading) return;

    if (difference) {
      setRoundDifference(Math.round(difference));
    }

    const formattedValue = isTimeMetric
      ? `${Number(value).toFixed(1)} Hrs`
      : Number(value).toLocaleString();

    if (animated && !loading) {
      // Animate value counting up
      let start = 0;
      const end = Number(value);
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(formattedValue);
          clearInterval(timer);
        } else {
          const currentValue = isTimeMetric
            ? `${start.toFixed(1)} Hrs`
            : Math.floor(start).toLocaleString();
          setDisplayValue(currentValue);
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(formattedValue);
    }
  }, [difference, value, isTimeMetric, animated, loading]);

  const formatTaskTime = (minutes) => {
    if (!minutes || minutes === "0") return null;
    const numMinutes = parseFloat(minutes);
    if (numMinutes >= 60) {
      const hours = (numMinutes / 60).toFixed(1);
      return `${hours}h per task`;
    }
    return `${minutes}min per task`;
  };

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  if (loading) {
    return (
      <StyledCard
        sx={sx}
        cardcolor={theme.palette.grey}
        size={size}
        loading={loading}
        elevation={0}
      >
        <CardContent sx={{ pb: config.cardPadding }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={config.spacing}
          >
            <Stack spacing={config.contentSpacing} flex={1}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="rectangular" width="60%" height={24} sx={{ borderRadius: 1 }} />
            </Stack>
            <Skeleton variant="circular" width={config.iconWrapper} height={config.iconWrapper} />
          </Stack>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard
      sx={sx}
      cardcolor={colo}
      size={size}
      loading={loading}
      elevation={0}
      onClick={handleClick}
    >
      <CardContent sx={{ pb: config.cardPadding }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={config.spacing}
        >
          <Stack spacing={config.contentSpacing} flex={1}>
            <TitleTypography
              variant="subtitle2"
              size={size}
            >
              {title}
            </TitleTypography>

            <MetricValue
              variant="h3"
              className="metric-value"
              component="div"
              size={size}
              loading={loading}
            >
              {displayValue}
            </MetricValue>

            {(roundDifference > 0 || customLabel) && (
              <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                {roundDifference > 0 && (
                  <StyledChip
                    icon={positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    label={customLabel || `${roundDifference} min saved`}
                    size="small"
                    positive={positive}
                    cardcolor={colo}
                    size={size}
                  />
                )}

                {task_per_minute && task_per_minute !== "0" && showDivider && (
                  <>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        height: config.chipHeight * 0.7,
                        opacity: 0.6,
                      }}
                    />
                    <CaptionTypography
                      variant="caption"
                      size={size}
                    >
                      {formatTaskTime(task_per_minute)}
                    </CaptionTypography>
                  </>
                )}
              </Stack>
            )}
          </Stack>

          <IconWrapper cardcolor={colo} size={size} loading={loading}>
            <SvgIcon
              className="metric-icon"
              sx={{
                fontSize: config.iconSize,
                color: colo[600],
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </SvgIcon>
          </IconWrapper>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

NumberBlock.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  colo: PropTypes.object.isRequired,
  task_per_minute: PropTypes.string,
  size: PropTypes.oneOf(['extrasmall', 'small', 'medium', 'large']),
  loading: PropTypes.bool,
  animated: PropTypes.bool,
  showDivider: PropTypes.bool,
  customLabel: PropTypes.string,
  onClick: PropTypes.func,
};

NumberBlock.defaultProps = {
  positive: true,
  task_per_minute: "0",
  size: "medium",
  loading: false,
  animated: true,
  showDivider: true,
};