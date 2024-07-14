import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TraineeAppbar from './TraineeAppbar';

const TraineeCurrentTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { traineeId } = useParams();

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainees/${traineeId}/trainers/current`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrainer(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [traineeId]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;

  return (
    <div className="flex h-screen">
      <TraineeAppbar />
      <div className="overflow-x-auto w-full flex justify-center items-center">
        <div className="m-5 w-full max-w-lg">
          <h1 className="text-xl font-semibold mb-4">Current Trainer</h1>
          {trainer && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <img src={trainer.photo} alt={trainer.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">{trainer.name}</h2>
              <p className="text-gray-700 text-center"><strong>Email:</strong> {trainer.email}</p>
              <p className="text-gray-700 text-center"><strong>Phone:</strong> {trainer.phone}</p>
              <p className="text-gray-700 text-center"><strong>Instagram:</strong> <a href={`https://instagram.com/${trainer.instagram}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">{trainer.instagram}</a></p>
              <p className="text-gray-700 text-center"><strong>Website:</strong> <a href={`https://${trainer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">{trainer.website}</a></p>
              <p className="text-gray-700 mt-4">{trainer.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraineeCurrentTrainer;
