import React from "react";
import styled, { keyframes } from "styled-components";

// const base = "#263238";
const lite = "#007fff";
// const brand = "#ff3d00";
const size = "90px";

const animFw = keyframes`
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
`;

const coli1 = keyframes`
    0% {
        transform: rotate(-45deg) translateX(0px);
        opacity: 0.7;
    }
    100% {
        transform: rotate(-45deg) translateX(-45px);
        opacity: 0;
    }
`;

const coli2 = keyframes`
    0% {
        transform: rotate(45deg) translateX(0px);
        opacity: 1;
    }
    100% {
        transform: rotate(45deg) translateX(-45px);
        opacity: 0.7;
    }
`;

const Loader73 = styled.span`
  width: 0;
  height: calc(${size} / 10);
  display: inline-block;
  position: relative;
  background: ${lite};
  box-shadow: 0 0 90px rgba(${lite}, 1);
  animation: ${animFw} 8s linear infinite;

  &::after,
  &::before {
    content: "";
    width: 10px;
    height: 1px;
    background: ${lite};
    position: absolute;
    top: 9px;
    right: -9px;
    opacity: 0;
    transform: rotate(-45deg) translateX(10px);
    animation: ${coli1} 0.3s linear infinite;
  }

  &::before {
    top: -4px;
    transform: rotate(45deg);
    animation: ${coli2} 0.3s linear infinite;
  }
`;

const Section = styled.section`
  min-width: 200px;
  width: 33.33%;
  height: 5px;
  padding: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  cursor: pointer;
  transition: 0.6s linear;

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

// const AppHeader = styled.header`
//   background: #0d161b;
//   padding: 10px 20px;
//   min-height: 50px;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   z-index: 2000;
//   justify-content: space-between;
// `;
//
// const NavBtn = styled.a`
//   color: #fff;
//   text-decoration: none;
// `;

const NdLoader = () => {
  return (
    <Section data-index="73">
      <Loader73 />
    </Section>
  );
};

export default NdLoader;
