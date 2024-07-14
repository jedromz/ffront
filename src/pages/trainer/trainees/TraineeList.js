import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Ensure useParams is imported
import Appbar from '../components/Appbar';

export default function TraineeList() {
    const [trainees, setTrainees] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { trainerId } = useParams(); // Retrieve the trainerId from the URL

    useEffect(() => {
        // Fetch trainees for the trainer using the trainerId from the URL
        fetch(`/api/trainers/${trainerId}/trainees`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTrainees(data);
            })
            .catch(error => {
                console.error("There was an error fetching the trainees: ", error);
            });
    }, [trainerId]); // Dependency on trainerId to rerun the effect when the trainerId changes

    const handleRowClick = async (traineeId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/trainees/${traineeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch trainee details');
            }
            const data = await response.json();
            setSelectedTrainee(data);
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTrainee(null);
    };

    return (
        <div className='flex'>
            <Appbar />
            <div className="overflow-x-auto w-full">
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-5">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">Name</th>
                                <th scope="col" className="py-3 px-6">Email</th>
                                <th scope="col" className="py-3 px-6">Height</th>
                                <th scope="col" className="py-3 px-6">Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainees.map((trainee) => (
                                <tr key={trainee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => handleRowClick(trainee.id)}>
                                    <td className="py-4 px-6">{trainee.name}</td>
                                    <td className="py-4 px-6">{trainee.email}</td>
                                    <td className="py-4 px-6">{trainee.height}</td>
                                    <td className="py-4 px-6">{trainee.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && selectedTrainee && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={closeModal}>
                    <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedTrainee.name}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Email: {selectedTrainee.email}</p>
                                <p className="text-sm text-gray-500">Height: {selectedTrainee.height} m</p>
                                <p className="text-sm text-gray-500">Weight: {selectedTrainee.weight} kg</p>
                            </div>
                            <div className="mt-4">
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
