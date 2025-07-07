import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Import your icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteIcon from '@mui/icons-material/Note';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';

const STEP_ICONS = [
  <LocationOnIcon key="location" sx={{ color: 'white', fontSize: 16 }} />,
  <PersonIcon key="person" sx={{ color: 'white', fontSize: 16 }} />,
  <LocalHospitalIcon key="hospital" sx={{ color: 'white', fontSize: 16 }} />,
  <EventIcon key="event" sx={{ color: 'white', fontSize: 16 }} />,
  <AccessTimeIcon key="time" sx={{ color: 'white', fontSize: 16 }} />,
  <CreateIcon key="note" sx={{ color: 'white', fontSize: 16 }} />,
  <CheckCircleIcon key="check" sx={{ color: 'white', fontSize: 16 }} />
];

const ProfessionalStepper = ({ currentStep, totalSteps, stepLabels, primaryColor, secondaryColor }) => {
  const progress = (currentStep / totalSteps) * 100;
  const completedSteps = Array.from({ length: currentStep - 1 }, (_, i) => i + 1);
  // Add ref for individual step elements to ensure proper scroll targeting
  const stepRefs = React.useRef([]);

  React.useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, stepLabels.length);
  }, [stepLabels.length]);

  const scrollContainerRef = React.useRef(null);

  // Enhanced auto-scroll to current step on mobile
  React.useEffect(() => {
    const scrollToCurrentStep = () => {
      if (scrollContainerRef.current && stepRefs.current[currentStep - 1]) {
        const container = scrollContainerRef.current;
        const currentStepElement = stepRefs.current[currentStep - 1];

        if (currentStepElement) {
          // Use scrollIntoView for more reliable scrolling
          currentStepElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    // Multiple timing strategies to ensure scroll happens
    scrollToCurrentStep(); // Immediate

    const timeoutId = setTimeout(scrollToCurrentStep, 50); // Short delay
    const timeoutId2 = setTimeout(scrollToCurrentStep, 200); // Longer delay

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [currentStep]);

  const MobileStepper = () => (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
      {/* All steps display */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflowX: 'auto',
          pb: 1,
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          '&::-webkit-scrollbar': {
            display: 'none' // Chrome, Safari
          },
          px: 2, // Add padding to ensure first and last steps are visible

          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '2px',
          },
        }}
      >
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <Box
              key={index}
              ref={el => stepRefs.current[index] = el}
              data-step={index} // Add data attribute for scroll targeting
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '70px', // Increased from 60px for better spacing
                position: 'relative',
                mx: 0.5,
                flex: '0 0 auto' // Prevent flex shrinking
              }}
            >
              {/* Step Icon */}
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '12px',
                mb: 0.5,
                background: isCompleted
                  ? 'linear-gradient(135deg, #4CAF50, #388E3C)'
                  : isCurrent
                    ? `linear-gradient(135deg, ${primaryColor}, #1976D2)`
                    : '#f5f5f5',
                color: isCompleted || isCurrent ? 'white' : 'grey.500',
                border: isUpcoming ? '2px solid #e0e0e0' : 'none',
                boxShadow: isCompleted
                  ? '0 2px 6px rgba(76, 175, 80, 0.3)'
                  : isCurrent
                    ? `0 2px 8px ${alpha(primaryColor, 0.4)}`
                    : 'none',
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 2
              }}>
                {isCompleted ? '✓' : STEP_ICONS[index]}
              </Box>

              {/* Connector line - positioned below the icon */}
              {index < stepLabels.length - 1 && (
                <Box sx={{
                  position: 'absolute',
                  top: 14,
                  left: '50%',
                  width: '60px',
                  height: '2px',
                  backgroundColor: isCompleted ? '#4CAF50' : 'grey.300',
                  zIndex: 1,
                  transition: 'background-color 0.3s ease'
                }} />
              )}

              {/* Step Label */}
              <Typography variant="caption" sx={{
                color: isCurrent ? primaryColor : isCompleted ? '#4CAF50' : 'text.secondary',
                fontWeight: isCurrent ? 600 : 500,
                textAlign: 'center',
                fontSize: '10px',
                lineHeight: 1.2,
                maxWidth: '60px',
                wordWrap: 'break-word'
              }}>
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const DesktopStepper = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', position: 'relative' }}>
      {stepLabels.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <Box key={index} sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            position: 'relative'
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
              mb: 1,
              background: isCompleted
                ? 'linear-gradient(135deg, #4CAF50, #388E3C)'
                : isCurrent
                  ? `linear-gradient(135deg, ${primaryColor}, #1976D2)`
                  : '#f5f5f5',
              color: isCompleted || isCurrent ? 'white' : 'grey.500',
              border: isUpcoming ? '2px solid #e0e0e0' : 'none',
              boxShadow: isCompleted
                ? '0 2px 8px rgba(76, 175, 80, 0.3)'
                : isCurrent
                  ? `0 2px 12px ${alpha(primaryColor, 0.4)}`
                  : 'none',
              transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 2
            }}>
              {isCompleted ? '✓' : STEP_ICONS[index]}
            </Box>

            <Typography variant="caption" sx={{
              color: isCurrent ? primaryColor : 'text.secondary',
              fontWeight: isCurrent ? 600 : 500,
              textAlign: 'center',
              maxWidth: '80px',
              lineHeight: 1.3
            }}>
              {label}
            </Typography>

            {/* Connector line - positioned below the icon */}
            {index < stepLabels.length - 1 && (
              <Box sx={{
                position: 'absolute',
                top: 16,
                left: '50%',
                right: '-50%',
                height: '2px',
                backgroundColor: isCompleted ? '#4CAF50' : 'grey.300',
                zIndex: 1,
                transition: 'background-color 0.3s ease'
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <>
      <MobileStepper />
      <DesktopStepper />
    </>
  );
};

export default ProfessionalStepper;