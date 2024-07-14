import React, { useEffect, useState } from 'react';
import Appbar from '../trainer/components/Appbar';
import { useParams } from 'react-router-dom';
import TraineeAppbar from './TraineeAppbar';

const TraineesPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { traineeId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/trainees/${traineeId}/photos`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPhotos(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [traineeId]);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
    formData.append('title', 'New Trainee Photos');
    formData.append('content', 'Uploading new trainee photos.');
    formData.append('date', new Date().toISOString().split('T')[0]);

    setUploading(true);
    try {
      const response = await fetch(`/trainees/${traineeId}/report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Fetch updated photos after successful upload
      const updatedResponse = await fetch(`/trainees/${traineeId}/photos`);
      if (!updatedResponse.ok) {
        throw new Error(`HTTP error! status: ${updatedResponse.status}`);
      }
      const updatedPhotos = await updatedResponse.json();
      setPhotos(updatedPhotos);
      setSelectedFiles(null);
      setUploading(false);
    } catch (err) {
      setError(err);
      setUploading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;

  return (
    <div className="flex h-screen">
      <TraineeAppbar/>
      <div className="overflow-x-auto w-full">
        <div className="m-5">
          <h1 className="text-xl font-semibold mb-4">Trainee Photos</h1>
          <div className="mb-4">
            <form onSubmit={handleUpload} className="flex flex-col items-start">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Add New Photos'}
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Trainee ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineesPhotos;
