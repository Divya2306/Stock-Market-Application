import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./Spinner.scss";

/**
 * Component to display a loading spinner.
 */
const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <FaSpinner className="spinner__icon" />
    </div>
  );
};

export default Spinner;
