import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/AdminAddMoviePage.css";

const AdminAddMoviePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost:3001/api/admin/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, trailer_url: trailerUrl }),
    });
  
    if (res.ok) {
      setMessage("Movie added successfully!");
      setTitle("");
      setTrailerUrl("");

    
      navigate("");
    } else if (res.status === 400) {
      setMessage("Movie already exists.");
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to add movie');
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-add-movie-container">
        <h1 className="admin-title">Add New Movie</h1>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            name="trailer_url"
            placeholder="Trailer URL (optional)"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
          />
          <button type="submit">Add Movie</button>
        </form>
      </div>
      {message && <div className="message-box">{message}</div>}

      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
};

export default AdminAddMoviePage;
