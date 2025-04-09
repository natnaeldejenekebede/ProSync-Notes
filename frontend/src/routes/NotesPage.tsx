import { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Delete,
  PushPin,
  Share,
  Search,
  // @ts-ignore
  Info,
  Edit,
  Add,
  ArrowUpward,
  ArrowDownward,
  Close,
  FilterList,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import { styled, keyframes } from "@mui/material/styles";

const PREDEFINED_TAGS: { label: string; color: string }[] = [
  { label: "Work", color: "#F44336" },
  { label: "Personal", color: "#3F51B5" },
  { label: "Urgent", color: "#FF9800" },
  { label: "Leisure", color: "#9C27B0" },
];

const getTiltAngle = (noteId: number): number => {
  return Math.sin(noteId) * 1.5; // Returns a value between approximately -5 and +5.
};

// A helper function to create a keyframes animation. It keeps the same tilt
// so the note appears to "float" while preserving the initial rotation.
const createStickyAnimation = (tilt: number) => keyframes`
  0% { transform: rotate(${tilt}deg) translateY(0); }
  50% { transform: rotate(${tilt}deg) translateY(-4px); }
  100% { transform: rotate(${tilt}deg) translateY(0); }
`;

const StickyNoteCard = styled(Card)(({ tilt }: { tilt: number }) => ({
  transform: `rotate(${tilt}deg) translateY(0)`,
  transition: "transform 0.2s, box-shadow 0.2s",
  animation: `${createStickyAnimation(tilt)} 3s ease-in-out infinite`,
  "&:hover": {
    animation: "none", // Pause the floating animation on hover.
    transform: `rotate(${tilt}deg) translateY(-4px)`,
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  },
}));

type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string[] | null;
  due_date?: string | null;
  color?: string | null;
  pinned: boolean;
  shared_with_user_ids: number[];
  sort_order: number;
  user_id: number;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [shareTargetUserId, setShareTargetUserId] = useState("");
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailNote, setDetailNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addContent, setAddContent] = useState("");
  const [addColor, setAddColor] = useState("#ffffff");
  const [addDueDate, setAddDueDate] = useState("");
  const [addTags, setAddTags] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState("#ffffff");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTags, setEditTags] = useState("");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotes = async (search?: string, filter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filter) params.append("tag", filter);
      const response = await fetch(
        `https://collabnote-fullstack-app.onrender.com/notes?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;

    const fetchNotesPeriodically = async () => {
      try {
        const response = await fetch(
          "https://collabnote-fullstack-app.onrender.com/notes",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
          return;
        }

        const newNotes: Note[] = await response.json();

        // Only update the state if notes have changed
        const notesChanged =
          notes.length !== newNotes.length ||
          notes.some((note, index) => {
            const newNote = newNotes[index];
            return (
              note.id !== newNote.id ||
              note.title !== newNote.title ||
              note.content !== newNote.content ||
              note.pinned !== newNote.pinned ||
              note.color !== newNote.color ||
              note.due_date !== newNote.due_date ||
              note.shared_with_user_ids !== newNote.shared_with_user_ids ||
              note.sort_order !== newNote.sort_order ||
              note.tags?.join(",") !== newNote.tags?.join(",")
            );
          });

        if (notesChanged) {
          setNotes(newNotes);
        }
      } catch (err) {
        console.error("Error fetching notes periodically:", err);
      }
    };

    if (isLoggedIn) {
      pollingInterval = setInterval(fetchNotesPeriodically, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isLoggedIn, notes]);

  const applyTagFilter = () => {
    fetchNotes(searchQuery, tagFilter);
  };

  const handleOpenAdd = () => {
    setOpenAddDialog(true);
  };
  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    setAddTitle("");
    setAddContent("");
    setAddColor("#ffffff");
    setAddDueDate("");
    setAddTags("");
  };
  const createNote = async () => {
    if (!addTitle.trim() || !addContent.trim()) {
      alert("Title and Content are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://collabnote-fullstack-app.onrender.com/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: addTitle,
            content: addContent,
            color: addColor,
            dueDate: addDueDate || null,
            tags: addTags ? addTags.split(",").map((t) => t.trim()) : [],
          }),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await response.json();
      handleCloseAdd();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePinNote = async (noteId: number, currentPinned: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://collabnote-fullstack-app.onrender.com/notes/${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pinned: !currentPinned }),
        },
      );
      if (!response.ok) throw new Error("Failed to pin/unpin note");
      await response.json();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  const openShare = (noteId: number) => {
    const noteToShare = notes.find((note) => note.id === noteId);
    if (noteToShare) {
      setDetailNote(noteToShare); // Set the note details
    }
    setSelectedNotes([noteId]);
    setOpenShareDialog(true);
  };

  const shareNote = async () => {
    if (!shareTargetUserId) {
      alert("Please provide a target user ID");
      return;
    }
    setLoading(true);
    try {
      for (const noteId of selectedNotes) {
        const response = await fetch(
          `https://collabnote-fullstack-app.onrender.com/notes/${noteId}/share`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ targetUsername: shareTargetUserId }),
          },
        );
        if (!response.ok)
          throw new Error("Failed to share note - Username not Found");
        await response.json();
      }
      setShareTargetUserId("");
      setOpenShareDialog(false);
      setSelectedNotes([]);
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const removeNote = async (noteId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://collabnote-fullstack-app.onrender.com/notes/${noteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to remove note");
      await response.json();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  const [confirmDeleteSelectedOpen, setConfirmDeleteSelectedOpen] =
    useState(false);

  const openConfirmDeleteSelectedDialog = () => {
    setConfirmDeleteSelectedOpen(true);
  };

  const closeConfirmDeleteSelectedDialog = () => {
    setConfirmDeleteSelectedOpen(false);
  };

  const handleDeleteSelectedConfirmed = () => {
    massRemoveNotes();
    closeConfirmDeleteSelectedDialog();
  };

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const openConfirmDeleteDialog = (note: Note) => {
    setNoteToDelete(note);
    setConfirmDeleteDialogOpen(true);
  };

  const closeConfirmDeleteDialog = () => {
    setNoteToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (noteToDelete) {
      removeNote(noteToDelete.id);
    }
    closeConfirmDeleteDialog();
  };

  const massRemoveNotes = async () => {
    for (const nId of selectedNotes) {
      await removeNote(nId);
    }
    setSelectedNotes([]);
  };

  const handleSelectNote = (noteId: number) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const openDetail = (note: Note) => {
    setDetailNote(note);
    setEditMode(false);
    setOpenDetailDialog(true);
  };
  const closeDetail = () => {
    setDetailNote(null);
    setOpenDetailDialog(false);
  };
  useEffect(() => {
    if (detailNote) {
      setEditTitle(detailNote.title || "");
      setEditContent(detailNote.content || "");
      setEditColor(detailNote.color || "#ffffff");
      setEditDueDate(detailNote.due_date || "");
      setEditTags(detailNote.tags?.join(", ") || "");
    }
  }, [detailNote]);

  // @ts-ignore
  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const saveEditedNote = async () => {
    if (!detailNote) return;
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and Content are required!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://collabnote-fullstack-app.onrender.com/notes/${detailNote.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
            color: editColor,
            due_date: editDueDate || null,
            tags: editTags ? editTags.split(",").map((t) => t.trim()) : [],
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to update note");
      await response.json();
      fetchNotes(searchQuery, tagFilter);
      setEditMode(false);
      closeDetail();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const getContrastingTextColor = (bgColor: string): string => {
    // Convert hex color to RGB
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate YIQ
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black for light backgrounds and white for dark backgrounds
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  };

  const reorderNotes = async (sortedIds: number[]) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://collabnote-fullstack-app.onrender.com/notes/reorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ noteOrder: sortedIds }),
        },
      );
      if (!response.ok) throw new Error("Failed to reorder notes");
      await response.json();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  const moveNoteUp = (noteId: number) => {
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx < 1) return;
    const newArr = [...notes];
    const temp = newArr[idx];
    newArr[idx] = newArr[idx - 1];
    newArr[idx - 1] = temp;
    setNotes(newArr);
    reorderNotes(newArr.map((n) => n.id));
  };
  const moveNoteDown = (noteId: number) => {
    const idx = notes.findIndex((n) => n.id === noteId);
    if (idx === -1 || idx === notes.length - 1) return;
    const newArr = [...notes];
    const temp = newArr[idx];
    newArr[idx] = newArr[idx + 1];
    newArr[idx + 1] = temp;
    setNotes(newArr);
    reorderNotes(newArr.map((n) => n.id));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchNotes("", tagFilter);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isLoggedIn) {
        fetchNotes(searchQuery, tagFilter);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");

  const quotes = [
    "“The best way to predict the future is to create it.” – Abraham Lincoln",
    "“Your time is limited, so don’t waste it living someone else’s life.” – Steve Jobs",
    "“Success usually comes to those who are too busy to be looking for it.” – Henry David Thoreau",
    "“Don’t be afraid to give up the good to go for the great.” – John D. Rockefeller",
    "“I find that the harder I work, the more luck I seem to have.” – Thomas Jefferson",
    "“Success is walking from failure to failure with no loss of enthusiasm.” – Winston Churchill",
    "“The only limit to our realization of tomorrow will be our doubts of today.” – Franklin D. Roosevelt",
    "“It’s not whether you get knocked down, it’s whether you get up.” – Vince Lombardi",
    "“The way to get started is to quit talking and begin doing.” – Walt Disney",
    "“The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.” – Winston Churchill",
    "“Don’t let yesterday take up too much of today.” – Will Rogers",
    "“You learn more from failure than from success. Don’t let it stop you. Failure builds character.” – Unknown",
    "“It’s not whether you get knocked down, it’s whether you get up.” – Vince Lombardi",
    "“People who are crazy enough to think they can change the world, are the ones who do.” – Rob Siltanen",
    "“Knowing is not enough; we must apply. Wishing is not enough; we must do.” – Johann Wolfgang Von Goethe",
    "“Whether you think you can or think you can’t, you’re right.” – Henry Ford",
    "“The only way to do great work is to love what you do.” – Steve Jobs",
    "“The best time to plant a tree was 20 years ago. The second best time is now.” – Chinese Proverb",
    "“The best revenge is massive success.” – Frank Sinatra",
    "“The secret of getting ahead is getting started.” – Mark Twain",
    "“The best way to get started is to quit talking and begin doing.” – Walt Disney",
    "“The only limit to our realization of tomorrow will be our doubts of today.” – Franklin D. Roosevelt",
  ];

  useEffect(() => {
    // Select a random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://collabnote-fullstack-app.onrender.com/profile/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        );

        if (!response.ok) {
          console.log("Failed to fetch user data");
          return;
        }

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}, {username}!
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontStyle: "italic", color: "gray", mt: 1, mb: 3 }}
        >
          {quote}
        </Typography>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            startIcon={<Add />}
          >
            Add Note
          </Button>
          {selectedNotes.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={openConfirmDeleteSelectedDialog}
            >
              Delete Selected
            </Button>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            size="small"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Filter by Tag</InputLabel>
            <Select
              label="Filter by Tag"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Array.from(new Set(notes.flatMap((n) => n.tags ?? []))).map(
                (tag, i) => (
                  <MenuItem key={`tag-${tag}-${i}`} value={tag}>
                    {tag}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={applyTagFilter}
            startIcon={<FilterList />}
          >
            Apply Filter
          </Button>
        </Box>
        <Grid container spacing={2}>
          {notes.map((note) => {
            const textColor = getContrastingTextColor(note.color || "#FFFFFF");
            // Use the helper to get a deterministic tilt based on note.id.
            const tilt = getTiltAngle(note.id);

            return (
              <Grid key={note.id} item xs={12} sm={6} md={4} lg={3}>
                <StickyNoteCard
                  tilt={tilt}
                  sx={{ backgroundColor: note.color || "#ffffff", position: "relative" }}
                >
                  <Box
                    sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}
                  >
                    <Checkbox
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => handleSelectNote(note.id)}
                      color="default"
                      sx={{
                        color: "#000",
                        bgcolor: "#fff",
                        borderRadius: "4px",
                      }}
                      title="Select This Note"
                    />
                  </Box>
                  <CardContent
                    onClick={() => openDetail(note)}
                    sx={{
                      cursor: "pointer",
                      pt: 5,
                      mt: 2,
                      color: textColor, // Dynamic text color for contrast
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: textColor,
                      }}
                    >
                      {note.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        maxHeight: "6em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        color: textColor,
                      }}
                    >
                      {note.content}
                    </Typography>
                    {note.due_date && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          fontStyle: "italic",
                          color: textColor,
                        }}
                      >
                        Due: {note.due_date}
                      </Typography>
                    )}
                    {note.tags && note.tags.length > 0 && (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          color: textColor,
                        }}
                      >
                        {note.tags.map((tag, idx) => {
                          const preTag = PREDEFINED_TAGS.find(
                            (t) => t.label === tag,
                          );
                          return (
                            <Chip
                              key={`${note.id}-tag-${idx}`}
                              label={tag}
                              sx={{
                                bgcolor: preTag ? preTag.color : "#757575",
                                color: textColor,
                                fontWeight: 600,
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => togglePinNote(note.id, note.pinned)}
                        sx={{ color: note.pinned ? "#00695c" : textColor }}
                        title={note.pinned ? "Unpin Note" : "Pin Note"}
                      >
                        <PushPin />
                      </IconButton>
                      <IconButton
                        onClick={() => openShare(note.id)}
                        sx={{
                          color:
                            note.shared_with_user_ids.length > 0
                              ? "#3f51b5"
                              : textColor,
                        }}
                        title={
                          note.shared_with_user_ids.length > 0
                            ? `Shared with ${note.shared_with_user_ids.length} users`
                            : "Share"
                        }
                      >
                        <Share />
                      </IconButton>
                      <IconButton
                        onClick={() => openConfirmDeleteDialog(note)}
                        sx={{ color: "#f44336" }}
                        title="Delete This Note"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => moveNoteUp(note.id)}
                        sx={{ color: textColor }}
                        title="Move Note Left/Up"
                      >
                        <ArrowUpward />
                      </IconButton>
                      <IconButton
                        onClick={() => moveNoteDown(note.id)}
                        sx={{ color: textColor }}
                        title="Move Note Right/Down"
                      >
                        <ArrowDownward />
                      </IconButton>
                    </Box>
                  </CardActions>
                </StickyNoteCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={closeConfirmDeleteDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            Are you sure you want to delete the note{" "}
            <strong>{noteToDelete?.title}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Share Note
          <IconButton onClick={() => setOpenShareDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            Enter the username of the user you want to share with:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            type="text"
            value={shareTargetUserId}
            onChange={(e) => setShareTargetUserId(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={shareNote}
          >
            Share with User
          </Button>

          <Box sx={{ my: 3 }}>
            <hr />
          </Box>

          <DialogContentText
            sx={{ mt: 2, wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            Alternatively, copy the note's details or share via email or social
            media:
          </DialogContentText>

          {detailNote ? (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                Title:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {detailNote.title}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                Content:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  mb: 2,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {detailNote.content}
              </Typography>
              {detailNote.due_date && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    Due Date:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {detailNote.due_date}
                  </Typography>
                </>
              )}
              {detailNote.tags && detailNote.tags.length > 0 && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    Tags:
                  </Typography>
                  <Box
                    sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    {detailNote.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        sx={{
                          bgcolor:
                            PREDEFINED_TAGS.find((t) => t.label === tag)
                              ?.color || "#757575",
                          color: "#fff",
                          fontWeight: 600,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
              <Button
                variant="outlined"
                sx={{ mr: 1, mt: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Title: ${detailNote.title}\n\nContent: ${detailNote.content}\n\n${
                      detailNote.due_date
                        ? `Due Date: ${detailNote.due_date}\n\n`
                        : ""
                    }Tags: ${
                      detailNote.tags ? detailNote.tags.join(", ") : "None"
                    }`,
                  );
                  alert("Note details copied to clipboard!");
                }}
              >
                Copy All Details
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={`mailto:?subject=${encodeURIComponent(
                  detailNote.title,
                )}&body=${encodeURIComponent(
                  `Title: ${detailNote.title}\n\nContent: ${detailNote.content}\n\n${
                    detailNote.due_date
                      ? `Due Date: ${detailNote.due_date}\n\n`
                      : ""
                  }Tags: ${detailNote.tags ? detailNote.tags.join(", ") : "None"}`,
                )}`}
                sx={{ mr: 1, mt: 1 }}
              >
                Share via Email
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${detailNote.title}\n\n${detailNote.content}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                Share on Twitter
              </Button>
            </Box>
          ) : (
            <Typography
              sx={{
                mt: 2,
                color: "red",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Unable to load note details for sharing.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteSelectedOpen}
        onClose={closeConfirmDeleteSelectedDialog}
        aria-labelledby="confirm-delete-selected-title"
        aria-describedby="confirm-delete-selected-description"
      >
        <DialogTitle id="confirm-delete-selected-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-selected-description">
            Are you sure you want to delete the selected notes? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDeleteSelectedDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSelectedConfirmed}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailDialog}
        onClose={closeDetail}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleToggleEdit}
              title={editMode ? "Cancel Edit" : "Edit"}
            >
              <Edit />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {editMode ? "Edit Note" : "Note Details"}
            </Typography>
          </Box>
          <IconButton onClick={closeDetail} title="Close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            backgroundColor: editMode
              ? "#ffffff"
              : detailNote?.color || "#ffffff",
            transition: "background-color 0.2s",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: editMode
              ? "#000000"
              : getContrastingTextColor(detailNote?.color || "#ffffff"), // Black text in edit mode
          }}
        >
          {editMode ? (
            <>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#ffffff !important", // White background
                  "& .MuiInputBase-input": {
                    color: "#000000 !important", // Black text
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000 !important", // Black label
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000 !important", // Black border
                    },
                  },
                }}
              />
              <TextField
                label="Content"
                multiline
                rows={4}
                fullWidth
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#ffffff !important", // White background
                  "& .MuiInputBase-input": {
                    color: "#000000 !important", // Black text
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000 !important", // Black label
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000 !important", // Black border
                    },
                  },
                }}
              />
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#ffffff !important", // White background
                  "& .MuiInputBase-input": {
                    color: "#000000 !important", // Black text
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000 !important", // Black label
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000 !important", // Black border
                    },
                  },
                }}
              />
              <TextField
                label="Color"
                type="color"
                fullWidth
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#ffffff !important", // White background
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000 !important", // Black border
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000 !important", // Black label text
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#000000 !important", // Black label text when focused
                  },
                }}
              />
              <TextField
                label="Tags (comma separated)"
                fullWidth
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#ffffff !important", // White background
                  "& .MuiInputBase-input": {
                    color: "#000000 !important", // Black text
                  },
                  "& .MuiInputLabel-root": {
                    color: "#000000 !important", // Black label
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#000000 !important", // Black border
                    },
                  },
                }}
              />
            </>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Title:
              </Typography>
              <Typography
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  mb: 2,
                }}
              >
                {detailNote?.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Content:
              </Typography>
              <Typography
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  mb: 2,
                }}
              >
                {detailNote?.content}
              </Typography>
              {detailNote?.due_date && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Due Date:
                  </Typography>
                  <Typography sx={{ fontStyle: "italic", mb: 2 }}>
                    {detailNote?.due_date}
                  </Typography>
                </>
              )}
              {detailNote?.tags && detailNote.tags.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Tags:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {detailNote.tags.map((tag, idx) => {
                      const preTag = PREDEFINED_TAGS.find(
                        (t) => t.label === tag,
                      );
                      return (
                        <Chip
                          key={`${detailNote?.id}-tag-${idx}`}
                          label={tag}
                          sx={{
                            bgcolor: preTag ? preTag.color : "#757575",
                            color: getContrastingTextColor(
                              preTag?.color || "#757575",
                            ),
                            fontWeight: 600,
                          }}
                        />
                      );
                    })}
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetail} variant="text">
            Close
          </Button>
          {editMode && (
            <Button variant="contained" onClick={saveEditedNote}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseAdd}>
        <DialogTitle>Add a New Note</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Fill out the fields below to create a new note.
          </DialogContentText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              sx={{ color: "#000" }}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={3}
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
              sx={{ color: "#000" }}
            />
            <TextField
              label="Tags (predefined or custom)"
              fullWidth
              placeholder="Work, Leisure, Personal, etc."
              helperText="Select predefined tags: Work, Leisure, Urgent, or add your own."
              value={addTags}
              onChange={(e) => setAddTags(e.target.value)}
              sx={{ color: "#000" }}
            />
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={addDueDate}
              onChange={(e) => setAddDueDate(e.target.value)}
              sx={{ color: "#000" }}
            />
            <TextField
              type="color"
              label="Color"
              fullWidth
              value={addColor}
              onChange={(e) => setAddColor(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button variant="contained" onClick={createNote}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
