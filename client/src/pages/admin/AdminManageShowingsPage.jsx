import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
    <div style={{ padding: '2rem' }}>
      <h1>Manage Showings</h1>
      <ul>
        {showings.map((showing) => (
          <li key={showing.showing_id}>
            {showing.title} - {new Date(showing.showing_time).toLocaleString()}{' '}
            | Theater {showing.theater_id}
            <button
              onClick={() =>
                navigate(`/admin/edit-showing/${showing.showing_id}`)
              }
            >
              Edit
            </button>
            <button onClick={() => handleDelete(showing.showing_id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminManageShowingsPage;
