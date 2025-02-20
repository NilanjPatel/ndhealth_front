import CircularProgress from "@mui/joy/CircularProgress";

const Process_circle = (shouldRender) => {
  return (
    <div
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      {shouldRender && <CircularProgress size="lg" value={70} color="primary" />}
    </div>
  );
};

export default Process_circle;
