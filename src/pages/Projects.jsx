import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Use the API service
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Fade,
} from "@mui/material";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched projects:", res.data); // Debug log
      setProjects(res.data);
    } catch (err) {
      console.error("Fetch projects error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = { title, description: description || "" };
      await api.post("/api/projects", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error("Create project error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    setLoading(true);
    setError("");
    try {
      await api.delete(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTasks = (projectId) => {
    navigate(`/projects/${projectId}/tasks`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Your Projects
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <Card sx={{ p: 3, mb: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ py: 1 }}
              >
                Add Project
              </Button>
            </Box>
          </Card>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Project List
          </Typography>
          {projects.length === 0 && !loading ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No projects yet. Create one to get started!
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{project.title}</Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5, fontSize: "0.9rem" }}
                      >
                        {project.description || "No description"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewTasks(project._id)}
                        disabled={loading}
                      >
                        View Tasks
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(project._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default Projects;
