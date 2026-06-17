import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  // Fetch suggestions from /search as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedMovie("");

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

  // When user clicks a suggestion
  const handleSelect = (title) => {
    setQuery(title);
    setSelectedMovie(title);
    setSuggestions([]);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🎬 Movie Recommender</h1>
      <p style={styles.subheading}>Type a movie name to get recommendations</p>

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

      {selectedMovie && (
        <p style={styles.selected}>
          Selected: <strong>{selectedMovie}</strong>
        </p>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "60px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "8px",
  },
  subheading: {
    color: "#aaa",
    marginBottom: "30px",
  },
  searchWrapper: {
    position: "relative",
    width: "400px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#1a1a1a",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
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
    padding: "10px 16px",
    cursor: "pointer",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "0.95rem",
  },
  selected: {
    marginTop: "20px",
    color: "#aaa",
  },
};

export default App;
