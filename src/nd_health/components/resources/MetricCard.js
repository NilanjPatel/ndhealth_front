import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  People,
  AttachMoney,
  ShoppingCart,
  Visibility,
  Assessment,
  Receipt,
  Paid,
  MoneyOff,
  AccountBalanceWallet,
  CreditCard,
  Error
} from '@mui/icons-material';
import { CheckIcon } from "@heroicons/react/16/solid";

const iconMap = {
  users: People,
  revenue: AttachMoney,
  orders: ShoppingCart,
  views: Visibility,
  analytics: Assessment,
  invoice: Receipt,
  paid: Paid,
  unpaid: MoneyOff,
  wallet: AccountBalanceWallet,
  creditCard: CreditCard,
  error: Error,
  yes: CheckIcon,
};

const MetricCard = ({
                      title,
                      value,
                      icon = 'analytics',
                      trend,
                      trendValue,
                      color = 'primary',
                      prefix = '',
                      suffix = '',
                      subtitle,
                      size = 'medium'
                    }) => {
  const theme = useTheme();
  const IconComponent = iconMap[icon] || Assessment;

  // Get trend icon and color
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return TrendingFlat;
  };

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const TrendIcon = getTrendIcon();

  // Define sizes for different card sizes
  const cardHeight = size === 'large' ? 200 : size === 'small' ? 120 : size === 'extraSmall' ? 100 : 160;
  const cardWidth = size === 'large' ? 300 : size === 'small' ? 200 : size === 'extraSmall' ? 150 : 250;
  const valueSize = size === 'large' ? 'h2' : size === 'small' ? 'h4' : size === 'extraSmall' ? 'h5' : 'h3';
  const titleSize = size === 'large' ? 'h6' : size === 'small' ? 'body2' : size === 'extraSmall' ? 'caption' : 'body1';
  const avatarSize = size === 'large' ? 56 : size === 'small' ? 40 : size === 'extraSmall' ? 32 : 48;

  return (
    <Card
      sx={{
        height: cardHeight,
        width: cardWidth,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.2)} 100%)`,
        }}
      />

      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
          p: 2,
        }}
      >
        {/* Header with Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant={titleSize}
              color="text.secondary"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

          </Box>
          <Avatar
            sx={{
              bgcolor: theme.palette[color].main,
              width: avatarSize,
              height: avatarSize,
            }}
          >
            <IconComponent />
          </Avatar>
        </Box>

        {/* Main Value */}
        <Box sx={{ my: 1 }}>
          <Typography
            variant={valueSize}
            sx={{
              fontWeight: 700,
              color: theme.palette[color].main,
              lineHeight: 1,
            }}
          >
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, textAlign: 'right' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Trend Indicator */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendIcon
              sx={{
                color: getTrendColor(),
                fontSize: 20,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: getTrendColor(),
                fontWeight: 600,
              }}
            >
              {trendValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.oneOf(['users', 'revenue', 'orders', 'views', 'analytics', 'invoice', 'paid', 'unpaid', 'wallet', 'creditCard', 'error','yes']),
  trend: PropTypes.oneOf(['up', 'down', 'flat']),
  trendValue: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  subtitle: PropTypes.string,
  size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'large']),
};

export default MetricCard;