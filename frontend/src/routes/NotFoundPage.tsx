import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "background.default",
        color: "text.primary",
        padding: 3,
        animation: "fadeIn 0.5s ease",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "6rem",
          fontWeight: "bold",
          mb: 2,
          color: "primary.main",
          animation: "slideDown 0.5s ease-out",
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "text.secondary",
          animation: "fadeIn 0.5s ease-out 0.2s",
        }}
      >
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          px: 4,
          py: 1,
          fontSize: "1.1rem",
          fontWeight: "bold",
          animation: "slideUp 0.5s ease-out 0.4s",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        onClick={() => navigate("/")}
      >
        Go Back Home
      </Button>
    </Box>
  );
}
