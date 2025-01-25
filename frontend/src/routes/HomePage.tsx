import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const LandingPage = () => {
  const theme = useTheme();
  // @ts-ignore
  const isDarkMode = theme.palette.mode === "dark";

  const features = [
    {
      title: "Collaborative Editing",
      description:
        "Work together in real-time with team members and colleagues.",
      buttonText: "Start Editing",
      link: "/notes",
    },
    {
      title: "Cloud Sync",
      description: "Access your notes anytime, anywhere, on any device.",
      buttonText: "Learn More",
      link: "/notes",
    },
    {
      title: "Organized Workspace",
      description:
        "Keep your notes structured with folders, tags, and categories.",
      buttonText: "Explore Features",
      link: "/notes",
    },
    {
      title: "Secure Sharing",
      description:
        "Share notes securely with access controls and permission settings.",
      buttonText: "Share Notes",
      link: "/notes",
    },
    {
      title: "Powerful Search",
      description:
        "Find notes quickly with advanced search and filter options.",
      buttonText: "Search Notes",
      link: "/notes",
    },
    {
      title: "Dark Mode Support",
      description: "Work comfortably with an interface tailored to your needs.",
      buttonText: "Try Dark Mode",
      link: "/notes",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: "2rem 0",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#00695c",
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: 3,
          marginBottom: "2rem",
          animation: `${slideUp} 0.5s ease-out`,
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", marginBottom: "1rem", color: "white" }}
        >
          Welcome to CollabNote
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: "2rem", color: "white" }}>
          The ultimate tool for organizing, sharing, and collaborating on your
          notes with ease. Revolutionize your workflow today.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: "white",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        >
          Get Started
        </Button>
      </Container>

      {/* Features Section */}
      <Container>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}
              sx={{
                animation: `${slideUp} 0.6s ease-out`,
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: 3,
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "flex-start", padding: "1rem" }}
                >
                  <Button
                    component={Link}
                    to={feature.link}
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      color: "white",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.light,
                      },
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      <Box
        sx={{
          textAlign: "center",
          marginTop: "4rem",
          padding: "2rem",
          backgroundColor: "#00695c",
          color: theme.palette.text.primary,
          boxShadow: 3,
          animation: `${slideUp} 0.8s ease-out`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "white",
          }}
        >
          Ready to Elevate Your Note-Taking Experience?
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "1rem", color: "white" }}
        >
          Join thousands of users and start collaborating effectively today.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: "white",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
