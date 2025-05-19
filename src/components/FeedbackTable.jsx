// src/components/FeedbackTable.jsx
import React, { useState, useEffect } from 'react';
import { fetchSuggestions } from '../api/apiFeedback';

const FeedbackTable = ({ serviceName, itemsPerPage = 10, currentPage = 1 }) => {
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceName) return;
    setLoading(true);
    fetchSuggestions(serviceName, 100)
      .then(data => setAllSuggestions(data))
      .catch(err => setError('Failed to fetch suggestions'))
      .finally(() => setLoading(false));
  }, [serviceName]);

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = allSuggestions.slice(start, start + itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Suggestions for: <span className="text-blue-600">{serviceName}</span>
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : paginated.length === 0 ? (
        <p className="text-gray-500">No suggestions available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, idx) => (
                <tr key={start + idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{start + idx + 1}</td>
                  <td className="px-4 py-2 border">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{item.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;
