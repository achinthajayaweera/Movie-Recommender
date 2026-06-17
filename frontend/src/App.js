import React, { useState } from "react";

const API_BASE = "https://movie-recommender-520p.onrender.com";
const PLACEHOLDER = "https://via.placeholder.com/200x300?text=No+Poster";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedMovie("");
    setRecommendations([]);
    setError("");

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/search?query=${value}`);
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (title) => {
    setQuery(title);
    setSelectedMovie(title);
    setSuggestions([]);
    setRecommendations([]);
    setError("");
  };

  const handleRecommend = async () => {
    if (!selectedMovie) return;
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const res = await fetch(`${API_BASE}/recommend?movie=${selectedMovie}`);
      const data = await res.json();

      if (res.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not connect to the backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>🎬 Movie Recommender</h1>
        <p style={styles.subheading}>Discover movies similar to your favourites</p>
      </div>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search a movie..."
            style={styles.input}
          />

          {suggestions.length > 0 && (
            <ul style={styles.dropdown}>
              {suggestions.map((title, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(title)}
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => (e.target.style.background = "#2a2a2a")}
                  onMouseLeave={(e) => (e.target.style.background = "#1a1a1a")}
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleRecommend}
          disabled={!selectedMovie || loading}
          style={{
            ...styles.button,
            opacity: !selectedMovie || loading ? 0.5 : 1,
            cursor: !selectedMovie || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Loading..." : "Get Recommendations"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Spinner */}
      {loading && (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner} />
          <p style={{ color: "#aaa", marginTop: "12px" }}>Fetching recommendations...</p>
        </div>
      )}

      {/* Poster Grid */}
      {recommendations.length > 0 && (
        <div style={styles.resultsSection}>
          <h2 style={styles.resultsHeading}>
            Because you liked{" "}
            <span style={{ color: "#e50914", textTransform: "capitalize" }}>
              {selectedMovie}
            </span>
          </h2>

          <div style={styles.grid}>
            {recommendations.map((movie, i) => (
              <div
                key={i}
                style={{
                  ...styles.card,
                  transform: hoveredCard === i ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hoveredCard === i
                      ? "0 8px 24px rgba(229,9,20,0.4)"
                      : "0 2px 8px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  src={movie.poster || PLACEHOLDER}
                  alt={movie.title}
                  style={styles.poster}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <p style={styles.movieTitle}>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>Built with ❤️ using React + FastAPI + Scikit-learn</p>
      </div>

      {/* Spinner keyframe via style tag */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    background: "#141414",
    padding: "48px 20px 36px",
    textAlign: "center",
    borderBottom: "2px solid #e50914",
    marginBottom: "44px",
  },
  heading: {
    fontSize: "2.8rem",
    margin: "0 0 10px 0",
    letterSpacing: "1px",
  },
  subheading: {
    color: "#888",
    margin: 0,
    fontSize: "1rem",
  },
  searchSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    width: "100%",
  },
  searchWrapper: {
    position: "relative",
    width: "440px",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#1a1a1a",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    listStyle: "none",
    margin: "4px 0 0 0",
    padding: "4px 0",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "11px 16px",
    cursor: "pointer",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "0.95rem",
    textTransform: "capitalize",
  },
  button: {
    padding: "14px 40px",
    fontSize: "1rem",
    background: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    transition: "background 0.2s",
  },
  errorBox: {
    marginTop: "24px",
    padding: "12px 24px",
    background: "#2a0000",
    border: "1px solid #e50914",
    borderRadius: "8px",
    color: "#ff6b6b",
    fontSize: "0.95rem",
  },
  spinnerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #333",
    borderTop: "4px solid #e50914",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  resultsSection: {
    marginTop: "56px",
    width: "90%",
    maxWidth: "1100px",
    paddingBottom: "60px",
  },
  resultsHeading: {
    fontSize: "1.3rem",
    color: "#ccc",
    marginBottom: "32px",
    fontWeight: "normal",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#1a1a1a",
    borderRadius: "10px",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  poster: {
    width: "100%",
    aspectRatio: "2/3",
    objectFit: "cover",
  },
  movieTitle: {
    padding: "10px 8px",
    fontSize: "0.85rem",
    textAlign: "center",
    color: "#ddd",
    textTransform: "capitalize",
    margin: 0,
  },
  footer: {
    marginTop: "auto",
    width: "100%",
    background: "#141414",
    padding: "20px",
    textAlign: "center",
    color: "#555",
    fontSize: "0.85rem",
    borderTop: "1px solid #222",
  },
};

export default App;
