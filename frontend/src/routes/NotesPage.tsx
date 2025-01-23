import { useEffect, useState, useRef } from 'react';
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
  Chip
} from '@mui/material';
import {
  Delete,
  PushPin,
  Share,
  Search,
  Info,
  Edit,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';

const PREDEFINED_TAGS: { label: string; color: string }[] = [
  { label: 'Work', color: '#F44336' },
  { label: 'Personal', color: '#3F51B5' },
  { label: 'Urgent', color: '#FF9800' },
  { label: 'Leisure', color: '#9C27B0' }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [shareTargetUserId, setShareTargetUserId] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailNote, setDetailNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');
  const [addColor, setAddColor] = useState('#ffffff');
  const [addDueDate, setAddDueDate] = useState('');
  const [addTags, setAddTags] = useState('');

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState('#ffffff');
  const [editDueDate, setEditDueDate] = useState('');
  const [editTags, setEditTags] = useState('');

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotes = async (search?: string, filter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filter) params.append('tag', filter);
      const response = await fetch(`http://localhost:4000/notes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const applyTagFilter = () => {
    fetchNotes(searchQuery, tagFilter);
  };

  const handleOpenAdd = () => {
    setOpenAddDialog(true);
  };
  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    setAddTitle('');
    setAddContent('');
    setAddColor('#ffffff');
    setAddDueDate('');
    setAddTags('');
  };
  const createNote = async () => {
    if (!addTitle.trim() || !addContent.trim()) {
      alert('Title and Content are required!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: addTitle,
          content: addContent,
          color: addColor,
          dueDate: addDueDate || null,
          tags: addTags ? addTags.split(',').map((t) => t.trim()) : []
        })
      });
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
      const response = await fetch(`http://localhost:4000/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pinned: !currentPinned })
      });
      if (!response.ok) throw new Error('Failed to pin/unpin note');
      await response.json();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };

  const openShare = (noteId: number) => {
    setSelectedNotes([noteId]);
    setOpenShareDialog(true);
  };
  const shareNote = async () => {
    if (!shareTargetUserId) {
      alert('Please provide a target user ID');
      return;
    }
    setLoading(true);
    try {
      for (const noteId of selectedNotes) {
        const response = await fetch(`http://localhost:4000/notes/${noteId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ targetUserId: Number(shareTargetUserId) })
        });
        if (!response.ok) throw new Error('Failed to share note');
        await response.json();
      }
      setShareTargetUserId('');
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
      const response = await fetch(`http://localhost:4000/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to remove note');
      await response.json();
      fetchNotes(searchQuery, tagFilter);
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };
  const massRemoveNotes = async () => {
    for (const nId of selectedNotes) {
      await removeNote(nId);
    }
    setSelectedNotes([]);
  };

  const handleSelectNote = (noteId: number) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
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
      setEditTitle(detailNote.title || '');
      setEditContent(detailNote.content || '');
      setEditColor(detailNote.color || '#ffffff');
      setEditDueDate(detailNote.due_date || '');
      setEditTags(detailNote.tags?.join(', ') || '');
    }
  }, [detailNote]);

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
  };
  const saveEditedNote = async () => {
    if (!detailNote) return;
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Title and Content are required!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/notes/${detailNote.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          color: editColor,
          due_date: editDueDate || null,
          tags: editTags ? editTags.split(',').map((t) => t.trim()) : []
        })
      });
      if (!response.ok) throw new Error('Failed to update note');
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

  const reorderNotes = async (sortedIds: number[]) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/notes/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ noteOrder: sortedIds })
      });
      if (!response.ok) throw new Error('Failed to reorder notes');
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
      navigate('/login');
    } else {
      fetchNotes('', tagFilter);
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

  return (
    <>
      <LoadingOverlay loading={loading} />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleOpenAdd} sx={{ fontWeight: 600 }}>
            Add Note
          </Button>
          {selectedNotes.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={massRemoveNotes}
            >
              Delete Selected
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />
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
              {Array.from(new Set(notes.flatMap((n) => n.tags ?? []))).map((tag, i) => (
                <MenuItem key={`tag-${tag}-${i}`} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={applyTagFilter}>
            Apply
          </Button>
        </Box>
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid key={note.id} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  backgroundColor: note.color || '#ffffff',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}>
                  <Checkbox
                    checked={selectedNotes.includes(note.id)}
                    onChange={() => handleSelectNote(note.id)}
                    color="default"
                    sx={{
                      color: '#000',
                      bgcolor: '#fff',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
                <CardContent
                  onClick={() => openDetail(note)}
                  sx={{
                    cursor: 'pointer',
                    pt: 5,
                    mt: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#000'
                    }}
                  >
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      maxHeight: '6em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      color: '#000'
                    }}
                  >
                    {note.content}
                  </Typography>
                  {note.due_date && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        fontStyle: 'italic',
                        color: '#000'
                      }}
                    >
                      Due: {note.due_date}
                    </Typography>
                  )}
                  {note.tags && note.tags.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {note.tags.map((tag, idx) => {
                        const preTag = PREDEFINED_TAGS.find((t) => t.label === tag);
                        return (
                          <Chip
                            key={`${note.id}-tag-${idx}`}
                            label={tag}
                            sx={{
                              bgcolor: preTag ? preTag.color : '#757575',
                              color: '#fff',
                              fontWeight: 600
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => togglePinNote(note.id, note.pinned)}>
                      <PushPin />
                    </IconButton>
                    <IconButton onClick={() => openShare(note.id)}>
                      <Share />
                    </IconButton>
                    <IconButton onClick={() => removeNote(note.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => moveNoteUp(note.id)}>
                      <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={() => moveNoteDown(note.id)}>
                      <ArrowDownward />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the user ID to share with:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            type="number"
            value={shareTargetUserId}
            onChange={(e) => setShareTargetUserId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={shareNote}>
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailDialog} onClose={closeDetail} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {editMode ? (
            <TextField
              variant="outlined"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              sx={{ color: '#000' }}
            />
          ) : (
            <Typography sx={{ color: '#000' }}>
              {detailNote?.title}
            </Typography>
          )}
          <IconButton onClick={handleToggleEdit} title="Edit">
            <Edit />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            backgroundColor: editMode ? '#fff' : detailNote?.color || '#ffffff',
            transition: 'background-color 0.2s'
          }}
        >
          {editMode ? (
            <>
              <TextField
                label="Content"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 2, color: '#000' }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2, color: '#000' }}
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
              <TextField
                label="Color"
                type="color"
                fullWidth
                sx={{ mb: 2 }}
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
              />
              <TextField
                label="Tags (comma separated)"
                fullWidth
                sx={{ mb: 2, color: '#000' }}
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
              />
            </>
          ) : (
            <>
              <DialogContentText sx={{ whiteSpace: 'pre-wrap', color: '#000' }}>
                {detailNote?.content}
              </DialogContentText>
              {detailNote?.due_date && (
                <Typography variant="body2" sx={{ mt: 2, color: '#000', fontStyle: 'italic' }}>
                  Due: {detailNote?.due_date}
                </Typography>
              )}
              {(detailNote?.tags ?? []).length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(detailNote?.tags ?? []).map((tag, idx) => {
                    const preTag = PREDEFINED_TAGS.find((t) => t.label === tag);
                    return (
                      <Chip
                        key={`${detailNote?.id}-tag-${idx}`}
                        label={tag}
                        sx={{
                          bgcolor: preTag ? preTag.color : '#757575',
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Info />} onClick={closeDetail}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              sx={{ color: '#000' }}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={3}
              value={addContent}
              onChange={(e) => setAddContent(e.target.value)}
              sx={{ color: '#000' }}
            />
            <TextField
              label="Tags (predefined or custom)"
              fullWidth
              placeholder="Work, Leisure, Personal, etc."
              helperText="Select predefined tags: Work, Leisure, Urgent, or add your own."
              value={addTags}
              onChange={(e) => setAddTags(e.target.value)}
              sx={{ color: '#000' }}
            />
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={addDueDate}
              onChange={(e) => setAddDueDate(e.target.value)}
              sx={{ color: '#000' }}
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
