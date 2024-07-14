import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../components/Appbar';

export default function MentorshipsList() {
  const [mentorships, setMentorships] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newMentorship, setNewMentorship] = useState({
    startDate: '',
    endDate: '',
    price: 0,
    traineeName: '',
    email: '',
    firstName: '',
    lastName: '',
    type: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const { trainerId } = useParams();

  useEffect(() => {
    fetch(`/api/trainers/${trainerId}/mentorships`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMentorships(data);
      })
      .catch(error => {
        console.error("There was an error fetching the mentorships: ", error);
      });
    fetch(`/api/trainers/${trainerId}/trainees`)
      .then(response => response.json())
      .then(data => setTrainees(data))
      .catch(error => console.error("There was an error fetching the trainees: ", error));
  }, [trainerId]);

  const handleAddNewMentorship = () => {
    setShowAddModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newMentorship.startDate) newErrors.startDate = 'Start date is required';
    if (!newMentorship.endDate) newErrors.endDate = 'End date is required';
    if (newMentorship.startDate && newMentorship.endDate && newMentorship.startDate > newMentorship.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!newMentorship.price || newMentorship.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!newMentorship.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(newMentorship.email)) newErrors.email = 'Email is invalid';
    if (newMentorship.traineeSource === 'new_trainee') {
      if (!newMentorship.firstName) newErrors.firstName = 'First name is required';
      if (!newMentorship.lastName) newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const mentorshipData = {
      traineeEmail: newMentorship.email,
      trainerId: trainerId,
      fromDate: newMentorship.startDate,
      toDate: newMentorship.endDate,
      price: newMentorship.price,
      type: newMentorship.type,
      traineeName: newMentorship.traineeName,
    };

    try {
      const response = await fetch('/mentorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mentorshipData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);

      setShowAddModal(false);
      setMentorships([...mentorships, result]);
    } catch (error) {
      console.error('Error during mentorship creation:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewMentorship(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectTrainee = (event) => {
    setNewMentorship(prevState => ({
      ...prevState,
      traineeId: event.target.value,
      traineeSource: 'existing_trainee'
    }));
  };

  const handleNewTraineeEntry = (event) => {
    const { name, value } = event.target;
    setNewMentorship(prevState => ({ ...prevState, [name]: value, traineeSource: 'new_trainee' }));
  };

  const handleRowClick = async (index) => {
    const mentorshipId = mentorships[index].id;
    try {
      const response = await fetch(`/mentorships/${mentorshipId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mentorship details');
      }
      const data = await response.json();
      setSelectedMentorship(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedMentorship(null);
  };

  const headers = ['Start Date', 'End Date', 'Price', 'Trainee'];
  const rows = mentorships.map(mentorship => [
    mentorship.fromDate,
    mentorship.toDate,
    mentorship.price,
    mentorship.trainee_Name
  ]);

  return (
    <div className="flex h-screen">
      <Appbar />
      <div className="overflow-x-auto w-full">
        <div className="shadow-md sm:rounded-lg m-5 flex-grow">
          <div className="flex justify-between items-center p-5">
            <h2 className="text-lg font-medium">Mentorships</h2>
            <button
              onClick={handleAddNewMentorship}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add New Mentorship
            </button>
          </div>
          <div className="overflow-x-auto w-full">
            <div className="shadow-md sm:rounded-lg m-5 flex-grow">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} scope="col" className="py-3 px-6">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover-highlight" onClick={() => handleRowClick(rowIndex)}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="py-4 px-6">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Mentorship</h3>
              <form className="mt-2" onSubmit={handleSubmit}>
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="startDate"
                  type="date"
                  value={newMentorship.startDate}
                  onChange={handleChange}
                  required
                />
                {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="endDate"
                  type="date"
                  value={newMentorship.endDate}
                  onChange={handleChange}
                  required
                />
                {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="price"
                  type="number"
                  value={newMentorship.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                <label className="block mt-4 text-gray-700 font-semibold">Select Existing Trainee:</label>
                <select
                  className="mt-2 p-2 w-full border rounded-md"
                  name="traineeId"
                  value={newMentorship.traineeId}
                  onChange={handleSelectTrainee}
                >
                  <option value="">Select Trainee</option>
                  {trainees.map((trainee) => (
                    <option key={trainee.id} value={trainee.email}>
                      {trainee.name}
                    </option>
                  ))}
                </select>
                <label className="block mt-4 text-gray-700 font-semibold">Or Add New Trainee:</label>
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={newMentorship.firstName}
                  onChange={handleNewTraineeEntry}
                  required
                />
                {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={newMentorship.lastName}
                  onChange={handleNewTraineeEntry}
                  required
                />
                {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                <input
                  className="mt-2 p-2 w-full border rounded-md"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={newMentorship.email}
                  onChange={handleNewTraineeEntry}
                  required
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                <div className="items-center px-4 py-3">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="submit"
                  >
                    Add Mentorship
                  </button>
                </div>
              </form>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-white text-red-500 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedMentorship && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={closeModal}>
          <div className="relative mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="text-center p-4">
              <h3 className="text-2xl leading-6 font-medium text-gray-900 mb-4">{selectedMentorship.trainee.name}</h3>
              <div className="mt-2 text-lg">
                <p className="text-gray-700"><span className="font-semibold">From:</span> {selectedMentorship.fromDate}</p>
                <p className="text-gray-700"><span className="font-semibold">To:</span> {selectedMentorship.toDate}</p>
                <p className="text-gray-700"><span className="font-semibold">Price:</span> {selectedMentorship.price}</p>
                <h4 className="text-xl font-semibold mt-6 mb-2">Trainee Details</h4>
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {selectedMentorship.trainee.name}</p>
                <p className="text-gray-700"><span className="font-semibold">Email:</span> {selectedMentorship.trainee.email}</p>
                <p className="text-gray-700"><span className="font-semibold">Height:</span> {selectedMentorship.trainee.height}m</p>
                <p className="text-gray-700"><span className="font-semibold">Weight:</span> {selectedMentorship.trainee.weight}kg</p>
              </div>
              <div className="items-center px-4 py-3">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
