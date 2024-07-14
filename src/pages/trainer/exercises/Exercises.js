import React, { useState, useEffect } from 'react';
import Appbar from '../components/Appbar';

export default function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: '',
        description: '',
        category: ''
    });
    const [errors, setErrors] = useState({});

    const categories = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Endurance']; // Define your categories here

    useEffect(() => {
        fetch('/exercises')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setExercises(data);
            })
            .catch(error => {
                console.error("There was an error fetching the exercises: ", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExercise(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newExercise.name) newErrors.name = 'Name is required';
        if (!newExercise.description) newErrors.description = 'Description is required';
        if (!newExercise.category) newErrors.category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddExercise = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch('/exercises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newExercise)
            });

            if (!response.ok) {
                throw new Error('Failed to add exercise');
            }

            const addedExercise = await response.json();
            setExercises([...exercises, addedExercise]);
            setIsModalOpen(false);
            setNewExercise({ name: '', description: '', category: '' });
        } catch (error) {
            console.error("There was an error adding the exercise: ", error);
        }
    };

    return (
        <div className='flex'>
            <Appbar />
            <div className="overflow-x-auto w-full">
                <div className="p-5">
                    <h1 className="text-xl font-semibold mb-4">Exercises</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mb-4 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add Exercise
                    </button>
                    <div className="overflow-x-auto relative h-96">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Exercise Name</th>
                                    <th scope="col" className="py-3 px-6">Description</th>
                                    <th scope="col" className="py-3 px-6">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.map((exercise) => (
                                    <tr key={exercise.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="py-4 px-6">{exercise.name}</td>
                                        <td className="py-4 px-6">{exercise.description}</td>
                                        <td className="py-4 px-6">{exercise.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setIsModalOpen(false)}>
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Exercise</h3>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={newExercise.name}
                                    onChange={handleInputChange}
                                    placeholder="Exercise Name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                <textarea
                                    name="description"
                                    value={newExercise.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    rows="4"
                                ></textarea>
                                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                <select
                                    name="category"
                                    value={newExercise.category}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                            </div>
                            <div className="items-center px-4 py-3">
                                <button 
                                    onClick={handleAddExercise}
                                    className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Add Exercise
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-2 px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
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
