import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

export default LoadingSpinner;
