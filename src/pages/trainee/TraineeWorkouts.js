import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NumberTile from '../trainer/components/NumberTile';
import IconTile from '../trainer/components/IconTile';
import Appbar from '../trainer/components/Appbar';
import TraineeAppbar from './TraineeAppbar';

export default function TraineeWorkoutsList() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedTrainingPlan, setSelectedTrainingPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { traineeId } = useParams();

    useEffect(() => {
        fetch(`/trainees/${traineeId}/workoutplans`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setWorkouts(data);
            })
            .catch(error => {
                console.error("There was an error fetching the workouts: ", error);
            });
    }, [traineeId]);

    const handleTrainingPlanClick = async (workoutId) => {
        try {
            const response = await fetch(`/workoutplans/${workoutId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch training plan details');
            }
            const data = await response.json();
            setSelectedTrainingPlan(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTrainingPlan(null);
    };

    const groupExercisesByDay = (exercises) => {
        return exercises.reduce((acc, exercise) => {
            (acc[exercise.dayOfWeek] = acc[exercise.dayOfWeek] || []).push(exercise);
            return acc;
        }, {});
    };

    return (
        <div className="flex h-screen">
            <TraineeAppbar />
            <div className="overflow-x-auto w-full">
                <div className="shadow-md sm:rounded-lg m-5 flex-grow">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">Name</th>
                                <th scope="col" className="py-3 px-6">Description</th>
                                <th scope="col" className="py-3 px-6">Start Date</th>
                                <th scope="col" className="py-3 px-6">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workouts.map((workout) => (
                                <tr key={workout.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => handleTrainingPlanClick(workout.id)}>
                                    <td className="py-4 px-6">{workout.name}</td>
                                    <td className="py-4 px-6">{workout.description}</td>
                                    <td className="py-4 px-6">{workout.fromDate}</td>
                                    <td className="py-4 px-6">{workout.toDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedTrainingPlan && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={closeModal}>
                    <div className="relative mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedTrainingPlan.name}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{selectedTrainingPlan.description}</p>
                                <p className="text-sm text-gray-500">From: {selectedTrainingPlan.fromDate}</p>
                                <p className="text-sm text-gray-500">To: {selectedTrainingPlan.toDate}</p>
                                <h4 className="text-md font-semibold mt-4">Exercises by Day</h4>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedTrainingPlan.exercies && Object.entries(groupExercisesByDay(selectedTrainingPlan.exercies)).map(([day, exercises]) => (
                                        <div key={day} className="p-4 border rounded-md bg-gray-50">
                                            <h5 className="text-md font-semibold mb-2">{day}</h5>
                                            <ul className="list-disc list-inside">
                                                {exercises.map((exercise, index) => (
                                                    <li key={index} className="text-sm text-gray-500">{exercise.exerciseOrder}. {exercise.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
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
