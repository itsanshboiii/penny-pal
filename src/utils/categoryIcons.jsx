import React from 'react';

// Custom icon components using SVG
const FaUtensils = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 3H13V10H11V3ZM5.5 3L6.5 10H8.5L9.5 3H5.5ZM18 3L19 10H20.5L21.5 3H18ZM22 14C22 14.6 21.6 15 21 15H3C2.4 15 2 14.6 2 14V12C2 11.4 2.4 11 3 11H21C21.6 11 22 11.4 22 12V14ZM21 17H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17Z"/>
  </svg>
);

const FaShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 7V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V7H5C3.9 7 3 7.9 3 9V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V9C21 7.9 20.1 7 19 7H16ZM10 4H14V7H10V4ZM19 18H5V9H19V18Z"/>
  </svg>
);

const FaHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
  </svg>
);

const FaCar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 13L6.5 8.5H17.5L19 13H5ZM17.5 18C16.7 18 16 17.3 16 16.5S16.7 15 17.5 15 19 15.7 19 16.5 18.3 18 17.5 18ZM6.5 18C5.7 18 5 17.3 5 16.5S5.7 15 6.5 15 8 15.7 8 16.5 7.3 18 6.5 18ZM18.9 8C18.7 7.4 18.1 7 17.5 7H6.5C5.8 7 5.3 7.4 5.1 8L3 14V22C3 22.6 3.4 23 4 23H5C5.6 23 6 22.6 6 22V21H18V22C18 22.6 18.4 23 19 23H20C20.6 23 21 22.6 21 22V14L18.9 8Z"/>
  </svg>
);

const FaMedkit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V6H4C2.9 6 2 6.9 2 8V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V8C22 6.9 21.1 6 20 6ZM10 4H14V6H10V4ZM16 15H13V18H11V15H8V13H11V10H13V13H16V15Z"/>
  </svg>
);

const FaGraduationCap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9L5 11.2V17.2L12 21L19 17.2V11.2L21 10.2V17H23V9L12 3ZM18.2 9L12 12.7L5.8 9L12 5.3L18.2 9ZM17 15.9L12 18.8L7 15.9V12.3L12 15.2L17 12.3V15.9Z"/>
  </svg>
);

const FaPlane = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
  </svg>
);

const FaGamepad = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 7.5V2H9V7.5L12 10.5L15 7.5ZM7.5 9H2V15H7.5L10.5 12L7.5 9ZM9 16.5V22H15V16.5L12 13.5L9 16.5ZM16.5 9L13.5 12L16.5 15H22V9H16.5Z"/>
  </svg>
);

const FaGift = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 6H17.8C18.4 5.4 18.8 4.7 18.8 3.8C18.8 2.2 17.3 1 16 1C14.8 1 13.6 1.5 13 2.7L12 4.2L11 2.7C10.4 1.5 9.2 1 8 1C6.7 1 5.2 2.2 5.2 3.8C5.2 4.7 5.6 5.4 6.2 6H2V12H4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12H22V6ZM16 3C16.3 3 16.8 3.2 16.8 3.8C16.8 4.4 16.4 5 15.7 5H13L14.8 2.4C15.1 2.2 15.5 3 16 3ZM8 3C8.5 3 8.9 3.2 9.2 3.4L11 5H8.3C7.6 5 7.2 4.4 7.2 3.8C7.2 3.2 7.7 3 8 3ZM4 10H11V8H4V10ZM18 20H6V12H18V20ZM20 10H13V8H20V10Z"/>
  </svg>
);

const FaMoneyBillWave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18ZM12 7C10.3 7 9 8.3 9 10C9 11.7 10.3 13 12 13C13.7 13 15 11.7 15 10C15 8.3 13.7 7 12 7ZM6 17H18V15C18 13.3 14.7 12 12 12C9.3 12 6 13.3 6 15V17Z"/>
  </svg>
);

const FaEllipsisH = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 10C4.9 10 4 10.9 4 12S4.9 14 6 14 8 13.1 8 12 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12S16.9 14 18 14 20 13.1 20 12 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12S10.9 14 12 14 14 13.1 14 12 13.1 10 12 10Z"/>
  </svg>
);

export const categoryIcons = {
  'Food & Dining': <FaUtensils />,
  'Shopping': <FaShoppingBag />,
  'Housing': <FaHome />,
  'Transportation': <FaCar />,
  'Health & Medical': <FaMedkit />,
  'Education': <FaGraduationCap />,
  'Travel': <FaPlane />,
  'Entertainment': <FaGamepad />,
  'Gifts & Donations': <FaGift />,
  'Bills & Utilities': <FaMoneyBillWave />,
  'Other': <FaEllipsisH />
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || categoryIcons['Other'];
}; 