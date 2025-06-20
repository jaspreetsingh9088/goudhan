// src/screens/GoPoint/index.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoPoint = () => {
  const [data, setData] = useState(null);
    const token = localStorage.getItem('token');


  useEffect(() => {
  axios.get('https://goudhan.life/admin/api/go-points-details', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true
  })
  .then(res => setData(res.data))
  .catch(err => console.error(err));
}, []);


  if (!data) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Your Go Points: {data.total_points}</h2>
      <hr />
      <h4>Points Earned by Referrals:</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Referee</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Points</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((tx, idx) => (
            <tr key={tx.id}>
              <td>{idx + 1}</td>
              <td>{tx.user?.name || 'N/A'} ({tx.user?.phone_number})</td>
              <td>#{tx.order_id}</td>
              <td>{tx.product?.name || '—'}</td>
              <td>{tx.points_awarded}</td>
              <td>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoPoint;
