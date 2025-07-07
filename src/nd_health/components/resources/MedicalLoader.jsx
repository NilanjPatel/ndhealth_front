
import React from "react";
import styled, { keyframes } from "styled-components";

const heartColor = "#ff3d00";
const size = "60px";

// Heart pulse animation - mimics actual heartbeat rhythm
const heartPulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    14% {
        transform: scale(1.3);
        opacity: 0.8;
    }
    28% {
        transform: scale(1);
        opacity: 1;
    }
    42% {
        transform: scale(1.3);
        opacity: 0.8;
    }
    70% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

// Glow effect that pulses with the heart
const glowPulse = keyframes`
    0% {
        box-shadow: 0 0 20px rgba(255, 61, 0, 0.3);
    }
    14% {
        box-shadow: 0 0 40px rgba(255, 61, 0, 0.6);
    }
    28% {
        box-shadow: 0 0 20px rgba(255, 61, 0, 0.3);
    }
    42% {
        box-shadow: 0 0 40px rgba(255, 61, 0, 0.6);
    }
    70% {
        box-shadow: 0 0 20px rgba(255, 61, 0, 0.3);
    }
    100% {
        box-shadow: 0 0 20px rgba(255, 61, 0, 0.3);
    }
`;

// Ripple effect from the heart
const ripple = keyframes`
    0% {
        transform: scale(0.8);
        opacity: 0.8;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
`;

const HeartLoader = styled.div`
  position: relative;
  width: ${size};
  height: ${size};
  animation: ${heartPulse} 1.5s ease-in-out infinite;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 26px;
    height: 40px;
    background: ${heartColor};
    border-radius: 26px 26px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
    animation: ${glowPulse} 1.5s ease-in-out infinite;
  }
  
  &::before {
    left: 30px;
  }
  
  &::after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`;

// Ripple rings that emanate from the heart
const RippleRing = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${size};
    height: ${size};
    border: 2px solid ${heartColor};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${ripple} 1.5s ease-out infinite;

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
    }
`;

const Section = styled.section`
    min-width: 200px;
    width: 33.33%;
    height: 120px;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    cursor: pointer;
    transition: 0.6s linear;
    background: rgba(0, 0, 0, 0.1);

    &:nth-child(2n + 1) {
        background: rgba(0, 0, 0, 0);
    }

    &:hover {
        background: rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
        width: 50%;
    }
    @media (max-width: 480px) {
        width: 100%;
    }
`;

const LoaderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MedicalLoader = () => {
  return (
    <Section data-index="heart-pulse">
      <LoaderContainer>
        <RippleRing />
        <RippleRing />
        <RippleRing />
        <HeartLoader />
      </LoaderContainer>
    </Section>
  );
};

export default MedicalLoader;