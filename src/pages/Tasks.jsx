import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, isValid } from "date-fns";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  MenuItem,
  CircularProgress,
  Fade,
} from "@mui/material";

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Fetched tasks:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        title,
        description: description || "",
        status,
        projectId,
      };
      console.log("Submitting payload:", payload);
      if (editingTask) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingTask._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/tasks", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setTitle("");
      setDescription("");
      setStatus("Not Started");
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Submit task error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(
        err.response?.data?.message || editingTask
          ? "Failed to update task."
          : "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status || "Not Started");
    setError("");
  };

  const handleDelete = async (taskId) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Delete task error:", err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStatus("Not Started");
    setError("");
  };

  const formatDate = (date) => {
    if (!date || !isValid(new Date(date))) {
      console.log("Invalid date:", date);
      return "N/A";
    }
    return format(new Date(date), "MMM d, yyyy, h:mm a");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={500}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {editingTask ? "Edit Task" : "Tasks for Project"}
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
                label="Task Title"
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
              <TextField
                fullWidth
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ py: 1 }}
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
                {editingTask && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          </Card>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Task List
          </Typography>
          {tasks.length === 0 && !loading ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No tasks yet. Create one to get started!
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tasks.map((task) => (
                <Card key={task._id}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5, fontSize: "0.9rem" }}
                      >
                        {task.description || "No description"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      >
                        Status: {task.status || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, fontSize: "0.85rem" }}
                      >
                        Created: {formatDate(task.createdAt)}
                      </Typography>
                      {task.completedAt && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, fontSize: "0.85rem" }}
                        >
                          Completed: {formatDate(task.completedAt)}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleEdit(task)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(task._id)}
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

export default Tasks;
