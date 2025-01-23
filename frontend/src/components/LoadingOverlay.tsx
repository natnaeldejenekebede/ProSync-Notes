import { Box, CircularProgress } from "@mui/material";

type LoadingOverlayProps = {
  loading: boolean;
};

export default function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={80} />
    </Box>
  );
}
