import React, { useState, useEffect } from 'react';

const slogans = [
  {
    id: 1,
    title: "Reclaim 10+ Hours a Month",
    subtitle: "Do More Medicine, Less Paperwork",
    highlight: "10+ Hours",
    highlightColor: "#00bcd4", // cyan
    description: "Time saved = direct emotional relief",
    icon: "⏰",
    bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    audience: "physician"
  },
  {
    id: 2,
    title: "Stop Leaving Money on the Table",
    subtitle: "Cut Billing Errors by 25%",
    highlight: "25%",
    highlightColor: "#f44336", // red
    description: "Loss aversion + financial incentive",
    icon: "💰",
    bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    audience: "physician"
  },
  {
    id: 3,
    title: "Protect Your Practice",
    subtitle: "Prevent Rejected Claims Before They Happen",
    highlight: "Protect",
    highlightColor: "#ffffff",
    description: "Fear of compliance/paperwork consequences",
    icon: "🛡️",
    bgGradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    audience: "admin"
  },
  {
    id: 4,
    title: "Fewer No-Shows = More Revenue",
    subtitle: "More Patients Seen, More Revenue Earned",
    highlight: "More Patients",
    highlightColor: "#00bcd4",
    description: "Connects operational change to income",
    icon: "👥",
    bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    audience: "physician"
  },
  {
    id: 5,
    title: "Be Known for On-Time Care",
    subtitle: "Cut Waiting Time by 50%",
    highlight: "50%",
    highlightColor: "#00bcd4",
    description: "Reputation and patient satisfaction",
    icon: "⏱️",
    bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    audience: "physician"
  },
  {
    id: 6,
    title: "One Secure System",
    subtitle: "Fewer Calls, Fewer Headaches",
    highlight: "One System",
    highlightColor: "#ffffff",
    description: "Reduces cognitive load and promises relief",
    icon: "🔗",
    bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    audience: "admin"
  },
  {
    id: 7,
    title: "Instant OHIP Validation",
    subtitle: "Avoid Costly Re-bills",
    highlight: "Instant",
    highlightColor: "#00bcd4",
    description: "Direct connection to financial risk reduction",
    icon: "✅",
    bgGradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    audience: "admin"
  },
  {
    id: 8,
    title: "Turn Intake into Instant Action",
    subtitle: "eForms That Speed Care",
    highlight: "Instant Action",
    highlightColor: "#00bcd4",
    description: "Shows immediate workflow acceleration",
    icon: "⚡",
    bgGradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    audience: "physician"
  },
  {
    id: 9,
    title: "Protect Your Time",
    subtitle: "Automate Reminders, Reduce Admin Work",
    highlight: "Protect Your Time",
    highlightColor: "#ffffff",
    description: "Autonomy and work-life balance appeal",
    icon: "🛡️",
    bgGradient: "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)",
    audience: "physician"
  },
  {
    id: 10,
    title: "Secure Patient Records, Secure Trust",
    subtitle: "Share Safely in Minutes",
    highlight: "Minutes",
    highlightColor: "#00bcd4",
    description: "Trust is a major motivator",
    icon: "🔒",
    bgGradient: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
    audience: "admin"
  },
  {
    id: 11,
    title: "Make Your Front Desk Faster",
    subtitle: "Free Staff to Do What Matters",
    highlight: "Faster",
    highlightColor: "#00bcd4",
    description: "Empathy for staff pain",
    icon: "🏢",
    bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    audience: "admin"
  },
  {
    id: 12,
    title: "Measure, Improve, Repeat",
    subtitle: "Real Data That Grows Your Practice",
    highlight: "Grows Your Practice",
    highlightColor: "#00bcd4",
    description: "Appeals to control and improvement",
    icon: "📈",
    bgGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    audience: "physician"
  }
];

const MedicalPracticeSlideshow = ({
                                    autoAdvanceTime = 6000,
                                    showControls = true,
                                    targetAudience = "all", // "physician", "admin", or "all"
                                    slideHeight = "500px", // customizable slide height
                                    containerHeight = "100vh" // customizable container height
                                  }) => {
  const [currentSlideGroup, setCurrentSlideGroup] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Filter slogans based on target audience
  const filteredSlogans = targetAudience === "all"
    ? slogans
    : slogans.filter(slogan => slogan.audience === targetAudience);

  // Group slogans into sets of 3
  const slideGroups = [];
  for (let i = 0; i < filteredSlogans.length; i += 3) {
    slideGroups.push(filteredSlogans.slice(i, i + 3));
  }

  useEffect(() => {
    if (isPaused || slideGroups.length === 0) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlideGroup((prev) => (prev + 1) % slideGroups.length);
        setIsAnimating(false);
      }, 300);
    }, autoAdvanceTime);

    return () => clearInterval(timer);
  }, [autoAdvanceTime, slideGroups.length, isPaused]);

  const currentGroup = slideGroups[currentSlideGroup] || [];

  const handleSlideClick = (index) => {
    if (index !== currentSlideGroup) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlideGroup(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '100vw',
    margin: '0',
    padding: '2rem',
    minHeight: containerHeight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  };

  const slideContainerStyle = {
    width: '100%',
    minHeight: slideHeight,
    borderRadius: '24px',
    display: 'flex',
    gap: '2rem',
    padding: '1rem',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
    opacity: isAnimating ? 0.7 : 1,
  };

  const sloganCardStyle = (slogan, position) => ({
    flex: 1,
    minHeight: slideHeight,
    background: slogan.bgGradient,
    borderRadius: '20px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: position === 1 ? 'scale(1.05)' : 'scale(1)', // Center card slightly larger
    zIndex: position === 1 ? 2 : 1,
  });

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1
  };

  const contentStyle = {
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
    position: 'relative',
    padding: '2rem 1rem',
    width: '100%',
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    border: '2px solid rgba(255,255,255,0.3)',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
  };

  const titleStyle = {
    fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
    fontWeight: '800',
    marginBottom: '0.8rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    lineHeight: '1.1',
    whiteSpace: 'nowrap',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  };

  const subtitleStyle = {
    fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)',
    fontWeight: '400',
    marginBottom: '1.5rem',
    opacity: 0.95,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    lineHeight: '1.3'
  };

  const badgeStyle = {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '15px',
    padding: '0.4rem 0.8rem',
    fontWeight: '600',
    fontSize: '0.7rem',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };

  const indicatorsStyle = {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    marginTop: '2rem',
    flexWrap: 'wrap'
  };

  const indicatorStyle = (index) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: currentSlideGroup === index ? '#00bcd4' : 'rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    boxShadow: currentSlideGroup === index ? '0 0 20px #00bcd4' : 'none'
  });

  const progressBarStyle = {
    width: '100%',
    height: '6px',
    background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,188,212,0.3) 100%)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '1rem'
  };

  const progressFillStyle = {
    height: '100%',
    width: `${((currentSlideGroup + 1) / slideGroups.length) * 100}%`,
    background: 'linear-gradient(90deg, #00bcd4 0%, #00acc1 100%)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,188,212,0.5)'
  };

  const controlsStyle = {
    marginTop: '2rem',
    textAlign: 'center'
  };

  const buttonStyle = {
    background: isPaused
      ? 'linear-gradient(135deg, #f44336 0%, #e53935 100%)'
      : 'linear-gradient(135deg, #4caf50 0%, #43a047 100%)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '1rem',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
  };

  const renderTitle = (slogan) => {
    const parts = slogan.title.split(slogan.highlight);
    if (parts.length === 1) {
      return slogan.title;
    }

    const highlightStyle = {
      color: slogan.highlightColor,
      textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
      fontSize: '1.1em',
      fontWeight: '900'
    };

    return (
      <>
        {parts[0]}
        <span style={highlightStyle}>{slogan.highlight}</span>
        {parts[1]}
      </>
    );
  };

  const handleCardHover = (e, isEnter) => {
    if (isEnter) {
      e.currentTarget.style.transform = e.currentTarget.style.transform.includes('1.05')
        ? 'scale(1.1)'
        : 'scale(1.08)';
      e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
    } else {
      e.currentTarget.style.transform = e.currentTarget.style.transform.includes('1.1')
        ? 'scale(1.05)'
        : 'scale(1)';
      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
    }
  };

  if (slideGroups.length === 0) {
    return <div style={containerStyle}>No slogans available for the selected audience.</div>;
  }

  return (
    <>
      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        .floating-particle-1 {
          animation: float 2s ease-in-out infinite reverse;
        }
        
        .floating-particle-2 {
          animation: bounce 3s ease-in-out infinite;
        }
        
        .floating-particle-3 {
          animation: pulse 4s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .slide-container {
            flex-direction: column;
            gap: 1rem;
          }
          .slogan-card {
            transform: scale(1) !important;
          }
        }
      `}</style>

      <div style={containerStyle}>
        <div
          className="slide-container"
          style={slideContainerStyle}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {currentGroup.map((slogan, index) => (
            <div
              key={slogan.id}
              className="slogan-card"
              style={sloganCardStyle(slogan, index)}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onClick={() => {
                const nextGroup = (currentSlideGroup + 1) % slideGroups.length;
                handleSlideClick(nextGroup);
              }}
            >
              <div style={overlayStyle}></div>
              <div style={contentStyle}>
                {/* Icon */}
                <div
                  style={iconStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1) rotate(5deg)';
                    e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) rotate(0deg)';
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  {slogan.icon}
                </div>

                {/* Title */}
                <h1 style={titleStyle}>
                  {renderTitle(slogan)}
                </h1>

                {/* Subtitle */}
                <h2 style={subtitleStyle}>
                  {slogan.subtitle}
                </h2>

                {/* Badge */}
                <div
                  style={badgeStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'rgba(255,255,255,0.4)';
                    e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {slogan.audience === 'physician' ? '👩‍⚕️ Physicians' : '📋 Admin'}
                </div>
              </div>

              {/* Floating Particles */}
              <div className="floating-particle-1" style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '15px',
                height: '15px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '50%',
                zIndex: 1
              }}></div>
              <div className="floating-particle-2" style={{
                position: 'absolute',
                bottom: '15%',
                left: '15%',
                width: '12px',
                height: '12px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                zIndex: 1
              }}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Progress Bar */}
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>

        {/* Enhanced Slide Indicators */}
        {showControls && (
          <div style={indicatorsStyle}>
            {slideGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideClick(index)}
                style={indicatorStyle(index)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.3)';
                  e.target.style.boxShadow = currentSlideGroup === index ? '0 0 25px #00bcd4' : '0 0 15px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = currentSlideGroup === index ? '0 0 20px #00bcd4' : 'none';
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced Controls */}
        <div style={controlsStyle}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'} Slideshow
          </button>
          <span style={{
            color: '#666',
            fontSize: '0.9rem',
            background: 'rgba(255,255,255,0.8)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginLeft: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            🎯 Group {currentSlideGroup + 1} of {slideGroups.length} • ⏱️ {autoAdvanceTime/1000}s intervals
          </span>
        </div>
      </div>
    </>
  );
};

export default MedicalPracticeSlideshow;