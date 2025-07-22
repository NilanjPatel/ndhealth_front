import React, { useState, useEffect } from 'react';

// Header Component
const LoadingHeader = ({ title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
    <h2 style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      margin: '0 0 8px 0'
    }}>
      {title}
    </h2>
    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{subtitle}</p>
  </div>
);

// Animated Icon Component
const LoadingIcon = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
    <div style={{ position: 'relative' }}>
      {/* Outer spinning ring */}
      <div style={{
        width: '80px',
        height: '80px',
        border: '4px solid #dbeafe',
        borderRadius: '50%',
        borderTop: '4px solid #2563eb',
        animation: 'spin 1s linear infinite'
      }}></div>

      {/* Inner pulsing circle */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#2563eb',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      {/* Floating dots */}
      <div style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '12px',
        height: '12px',
        backgroundColor: '#10b981',
        borderRadius: '50%',
        animation: 'bounce 1s infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '-8px',
        width: '8px',
        height: '8px',
        backgroundColor: '#8b5cf6',
        borderRadius: '50%',
        animation: 'bounce 1s infinite 0.5s'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '-16px',
        width: '8px',
        height: '8px',
        backgroundColor: '#f59e0b',
        borderRadius: '50%',
        animation: 'bounce 1s infinite 1s',
        transform: 'translateY(-50%)'
      }}></div>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ progress, showProgress }) => {
  if (!showProgress) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '8px'
      }}>
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div style={{
        width: '100%',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        height: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          borderRadius: '9999px',
          width: `${progress}%`,
          transition: 'width 0.3s ease-out',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'pulse 2s infinite'
          }}></div>
        </div>
      </div>
    </div>
  );
};

// Current Step Component
const CurrentStep = ({ currentStep, steps }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: '#eff6ff',
      borderRadius: '9999px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        backgroundColor: '#2563eb',
        borderRadius: '50%',
        marginRight: '12px',
        animation: 'pulse 2s infinite'
      }}></div>
      <span style={{ color: '#1e40af', fontWeight: '500', fontSize: '14px' }}>
        {steps[currentStep]}
      </span>
    </div>
  </div>
);

// Time Estimate Component
const TimeEstimate = ({ duration, progress }) => (
  <div style={{ textAlign: 'center', marginTop: '24px' }}>
    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
      ⏱️ Estimated time: {Math.ceil((duration - (progress * duration / 100)) / 1000)}s remaining
    </p>
  </div>
);

// Data Animation Component
const DataAnimation = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '24px',
    gap: '4px'
  }}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          width: '8px',
          height: `${Math.random() * 20 + 10}px`,
          background: 'linear-gradient(to top, #93c5fd, #2563eb)',
          borderRadius: '9999px',
          animation: `pulse 2s infinite ${i * 0.2}s`
        }}
      ></div>
    ))}
  </div>
);

// Main Loading Component
const ProfessionalLoading = ({
                               title = "Processing Data",
                               subtitle = "Analyzing your data to generate insights...",
                               showProgress = true,
                               duration = 20000
                             }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Connecting to data sources...",
    "Validating data integrity...",
    "Running calculations...",
    "Generating insights...",
    "Finalizing results..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, duration / steps.length);

    return () => clearInterval(stepInterval);
  }, [duration, steps.length]);

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-25%); }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',       // <-- forces it to overlay entire screen
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,             // <-- ensures it appears above everything
        background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          maxWidth: '448px',
          width: '100%',
          margin: '0 16px',
          border: '1px solid #f3f4f6'
        }}>
          <LoadingHeader title={title} subtitle={subtitle} />
          <LoadingIcon />
          <ProgressBar progress={progress} showProgress={showProgress} />
          <CurrentStep currentStep={currentStep} steps={steps} />
          <TimeEstimate duration={duration} progress={progress} />
          <DataAnimation />
        </div>
      </div>
    </>
  );
};

// Enhanced version with multiple stages
const AdvancedDashboardLoading = ({ onComplete }) => {
  const [stage, setStage] = useState('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 'loading' && progress >= 100) {
        setStage('complete');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [progress, stage, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (stage === 'complete') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Data Ready!</h3>
          <p className="text-gray-600">Your dashboard is loading...</p>
        </div>
      </div>
    );
  }

  return <ProfessionalLoading title="Dashboard Analytics" subtitle="Crunching numbers to bring you powerful insights..." />;
};

export default ProfessionalLoading;