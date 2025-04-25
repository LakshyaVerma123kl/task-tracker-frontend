import { Link } from "react-router-dom";
import { Container, Typography, Button, Box, Grid, Fade } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const Home = () => {
  return (
    <Fade in timeout={1000}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0288d1 30%, #4fc3f7 90%)",
          display: "flex",
          alignItems: "center",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                color="white"
                gutterBottom
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                Task Tracker
              </Typography>
              <Typography
                variant="h5"
                color="white"
                paragraph
                sx={{ opacity: 0.9, mb: 4 }}
              >
                Streamline your projects and tasks with our intuitive app. Boost
                productivity and achieve your goals effortlessly.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    color: "white",
                    borderColor: "white",
                    "&:hover": { borderColor: "white" },
                  }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <TaskAltIcon
                sx={{
                  fontSize: { xs: 150, md: 200 },
                  color: "white",
                  opacity: 0.85,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default Home;
