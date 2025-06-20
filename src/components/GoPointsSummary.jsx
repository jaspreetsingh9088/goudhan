import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoPointsSummary = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError("User not logged in");

    axios.get('https://goudhan.life/admin/api/go-points-details', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load Go Points.");
      });
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!data) return <p>Loading Go Points...</p>;

  return (
    <div className="go-points-box card p-3 mt-4">
      <h5 className="mb-3">🎯 Total Go Points: <strong>{data.total_points}</strong></h5>
      <h6>Recent Transactions:</h6>
      <ul className="list-group list-group-flush">
        {data.transactions.slice(0, 3).map(tx => (
          <li key={tx.id} className="list-group-item">
            +{tx.points_awarded} from {tx.user?.name || 'N/A'} – {tx.product?.name || '—'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoPointsSummary;
