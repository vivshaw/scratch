import React, { FunctionComponent } from "react";
import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.css";

const LoadingSpinner: FunctionComponent = () => (
  <div className="LoadingSpinner">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
