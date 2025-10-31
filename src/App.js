import { use, useEffect, useState } from "react";
import "./App.css";

const API_KEY = "c12b3497cd5af9419fa21dfae0b1fc4d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";


function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      let url = "";

      if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      } else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
        if (sortBy) {
          url += `&sort_by=${sortBy}`;
        }
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results || []);
        if (page === 1) {
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    }

    fetchMovies();
  }, [page, query, sortBy]);

  return (
    <div>
      <h1>Movie Explorer</h1>

      <header>
        <input
          type="text"
          placeholder="Search for a movie..."
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setQuery(e.target.value.trim());
              setPage(1);
            }
          }}
        />


        <select
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >

          <option>Sort By</option>
          <option value="release_date.asc">Release Date (Asc)</option>
          <option value="release_date.desc">Release Date (Desc)</option>
          <option value="vote_average.asc">Rating (Asc)</option>
          <option value="vote_average.desc">Rating (Desc)</option>
        </select>
      </header>

      {/* Movie cards: */}
      <main id="movie-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie">
              <img
                src={
                  movie.poster_path
                    ? `${IMG_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p>Release: {movie.release_date || "N/A"}</p>
              <p>Rating: {movie.vote_average?.toFixed(1) ?? "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </main>

      {/* Page numbers and prev/next buttons */}
      <footer>
        <button onClick={() => setPage((p) => Math.max(p-1, 1))}disabled={page <= 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((p) => p+1)}disabled={page >= totalPages}>Next</button>
      </footer>
    </div>
  );
}

export default App;