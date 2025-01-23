import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Search as SearchIcon } from "@mui/icons-material";
import LoadingOverlay from "../components/LoadingOverlay";

const avatarImages = [
  "/OIP.jpg",
  "/OIP2.webp",
  "/OIP3.png",
  "/OIP4.png",
  "/OIP5.png",
  "/OIP6.webp",
  "/OIP7.webp",
  "/OIP8.webp",
  "/OIP9.webp",
  "/OIP10.webp",
  "/OIP11.webp",
  "/OIP12.webp",
  "/OIP13.webp",
  "/OIP14.webp",
  "/OIP15.webp",
  "/OIP16.webp",
  "/OIP17.webp",
  "/OIP18.webp",
  "/OIP19.webp",
  "/OIP20.webp",
];

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [daysSinceJoined, setDaysSinceJoined] = useState<
    number | string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [joinedDate, setJoinedDate] = useState("");
  const [error, setError] = useState("");
  const [randomAvatar, setRandomAvatar] = useState("");
  // @ts-ignore
  const [userData, setUserData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const userToken = localStorage.getItem("access_token");
  // @ts-ignore
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [notesCount, setNotesCount] = useState<number | null>(null);

  const fetchNotesCount = async () => {
    try {
      const res = await fetch(
        "https://collabnote-fullstack-app.onrender.com/notes",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch notes count");
      const data = await res.json();
      setNotesCount(data.length); // Assuming the response is an array of notes
    } catch (err) {
      console.error(err);
      setNotesCount(0); // Default to 0 if there's an error
    }
  };

  const fetchMyProfile = async () => {
    try {
      const res = await fetch(
        "https://collabnote-fullstack-app.onrender.com/profile/me",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUserData(data);
      if (data.created_at) {
        const joined = new Date(data.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - joined.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceJoined(diffDays);
        setJoinedDate(joined.toLocaleDateString());
      } else {
        setDaysSinceJoined("N/A");
        setJoinedDate("N/A");
      }
      setEmail(data.email || "N/A");
      setUsername(data.username || "N/A");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEmail = async () => {
    setUpdatingEmail(true);
    setError("");
    try {
      const res = await fetch(
        "https://collabnote-fullstack-app.onrender.com/profile/email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ newEmail }),
        },
      );
      if (!res.ok) throw new Error("Failed to update email");
      setEmail(newEmail);
      setIsEditingEmail(false);
    } catch (err) {
      setError("Failed to update email. Please try again.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setSearchLoading(true);
    setNoResults(false);

    try {
      const res = await fetch(
        `https://collabnote-fullstack-app.onrender.com/profile/search?username=${query}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      setSearchResults(data);
      setNoResults(data.length === 0);
    } catch (err) {
      console.error(err);
      setNoResults(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 300);
  };

  useEffect(() => {
    setRandomAvatar(
      avatarImages[Math.floor(Math.random() * avatarImages.length)],
    );
    if (!userToken) {
      setLoading(false);
      return;
    }
    fetchMyProfile().then(() => setLoading(false));
    fetchNotesCount().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingOverlay loading={true} />;
  }

  if (!userToken) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={4}
        height="100vh"
        sx={{
          backgroundColor: "background.default",
          transition: "background-color 0.3s ease",
        }}
      >
        <Typography variant="h5">
          You are not signed in. Please{" "}
          <a
            href="/login"
            style={{
              color: "#00695c",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            log in
          </a>{" "}
          to view your profile.
        </Typography>
      </Box>
    );
  }

  const today = new Date().toLocaleDateString();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.default",
        transition: "background-color 0.3s ease",
        pt: 8,
        pb: 8,
        minHeight: "calc(100vh - 64px - 56px)",
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <TextField
            fullWidth
            label="Search for Other Users"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                paddingRight: "40px",
              },
            }}
          />
          <SearchIcon
            sx={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "text.secondary",
            }}
          />
        </Box>
        {searchLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {!searchLoading && noResults && (
          <Typography textAlign="center" mt={2}>
            No user found with "{searchQuery}"
          </Typography>
        )}
        {!searchLoading && searchResults.length > 0 && (
          <Box mt={2}>
            {searchResults.map((user) => (
              <Paper
                key={user.id}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                }}
              >
                <Typography>
                  <strong>Username:</strong> {user.username}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Profile Information */}
      <Paper
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          p: 4,
          borderRadius: 2,
          width: "400px",
          textAlign: "center",
          boxShadow: 5,
          transition: "background-color 0.3s ease",
        }}
      >
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            overflow: "hidden",
            mx: "auto",
            mb: 2,
            border: "3px solid #00695c",
          }}
        >
          <img
            src={randomAvatar}
            alt="User Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Your Profile
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Email:</strong> {email}
          {!isEditingEmail && (
            <IconButton onClick={() => setIsEditingEmail(true)}>
              <EditIcon sx={{ "&:hover": { color: "#00695c" } }} />
            </IconButton>
          )}
        </Typography>
        {isEditingEmail && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="New Email"
              variant="outlined"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleUpdateEmail}
                variant="contained"
                color="primary"
                fullWidth
                disabled={updatingEmail}
              >
                {updatingEmail ? "Updating..." : "Update Email"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditingEmail(false);
                  setNewEmail(""); // Clear the input field
                  setError(""); // Clear any previous error
                }}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Cancel
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        )}
        <Typography sx={{ mb: 2 }}>
          <strong>Username:</strong> {username}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Days Since Joined:</strong> {daysSinceJoined}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Date Joined:</strong> {joinedDate}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Notes Created:</strong>{" "}
          {notesCount !== null ? notesCount : "Loading..."}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Today's Date:</strong> {today}
        </Typography>
        <div
          style={{
            height: 20,
            borderBottom: "1px solid #00695c",
            margin: "0 20px",
          }}
        />
        <Typography sx={{ mt: 2 }}>
          <strong>Thank you for using CollabNote today! 🚀</strong>
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.reload();
          }}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}
