import React from "react";

const Spinner = ({ color = "#ffffff", size = 50, numLines = 8 }) => {
  const lines = [];
  for (let i = 0; i < numLines; i++) {
    const angle = (360 / numLines) * i;
    lines.push(
      <div
        key={i}
        className="spinner-line"
        style={{
          borderColor: `${color} transparent transparent transparent`,
          transform: `rotate(${angle}deg)`,
          height: size,
          width: size,
        }}
      ></div>
    );
  }

  return (
    <div
      className="spinner-container"
      style={{
        height: size,
        width: size,
      }}
    >
      {lines}

      <style jsx>{`
        .spinner-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
        }

        .spinner-line {
          position: absolute;
          border-width: ${size / 10}px;
          border-style: solid;
          border-radius: 50%;
          animation: spin 1.2s linear infinite, fade 1.2s infinite ease-in-out;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fade {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
