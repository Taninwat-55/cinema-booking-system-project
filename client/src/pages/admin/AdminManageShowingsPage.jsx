import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import '../../styles/AdminManageShowingPage.css';

const AdminManageShowingsPage = () => {
  const [showings, setShowings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/showings')
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this showing?'
    );
    if (!confirm) return;

    const res = await fetch(`http://localhost:3001/api/admin/showings/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('Showing deleted!');
      setShowings(showings.filter((s) => s.showing_id !== id));
    } else {
      toast.error('Failed to delete showing');
    }
  };

  return (
    <>
    <Navbar />
    <div className="admin-manage-showings-container">
      <h1 className="admin-title">Manage Showings</h1>
      <ul className="showings-list">
        {showings.map((showing) => (
          <li key={showing.showing_id} className="showing-item">
            {showing.title} - {new Date(showing.showing_time).toLocaleString()} | Theater {showing.theater_id}
            <button
              className="admin-button edit-button"
              onClick={() =>
                navigate(`/admin/edit-showing/${showing.showing_id}`)
              }
            >
              Edit
            </button>
            <button
              className="admin-button delete-button"
              onClick={() => handleDelete(showing.showing_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="circle-one"></div>
    <div className="circle-two"></div>
    </>
  );
};

export default AdminManageShowingsPage;