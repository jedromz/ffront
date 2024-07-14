import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkoutBuilder = () => {
    const [exercises, setExercises] = useState([]);
    const [availableWorkouts, setAvailableWorkouts] = useState([]);
    const [plan, setPlan] = useState(days.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
    const [planName, setPlanName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTrainee, setSelectedTrainee] = useState('');
    const [trainees, setTrainees] = useState([]);
    const [errors, setErrors] = useState({});
    const { trainerId } = useParams();

    useEffect(() => {
        fetch(`/exercises`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setExercises(data))
            .catch(error => console.error("There was an error fetching the workouts: ", error));

        fetch(`/api/trainers/${trainerId}/mentorships`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error("There was an error fetching the mentorships: ", error);
            });

        fetch(`/api/trainers/${trainerId}/trainees`)
            .then(response => response.json())
            .then(data => setTrainees(data))
            .catch(error => console.error("There was an error fetching the trainees: ", error));
    }, [trainerId]);

    const onDragStart = (e, item, origin, day = null) => {
        const dragData = { item, origin, day };
        e.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDropToDay = (e, day) => {
        e.preventDefault();
        const { item, origin } = JSON.parse(e.dataTransfer.getData('application/reactflow'));
        if (origin === 'available' || origin === 'day') {
            if (!plan[day].find((i) => i.id === item.id)) {
                setPlan((current) => ({
                    ...current,
                    [day]: [...current[day], { ...item, sets: item.sets || 3, reps: item.reps || 10 }]
                }));
            }
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handlePlanNameChange = (e) => {
        setPlanName(e.target.value);
    };
    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };
    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleTraineeChange = (e) => {
        setSelectedTrainee(e.target.value);
    };

    const handleExerciseChange = (day, id, field, value) => {
        setPlan((current) => ({
            ...current,
            [day]: current[day].map((exercise) =>
                exercise.id === id ? { ...exercise, [field]: parseInt(value, 10) || '' } : exercise
            )
        }));
    };

    const removeExerciseFromDay = (day, id) => {
        setPlan((current) => ({
            ...current,
            [day]: current[day].filter((exercise) => exercise.id !== id)
        }));
    };

    const clearPlan = () => {
        setPlan(days.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!planName) newErrors.planName = 'Plan name is required';
        if (!fromDate) newErrors.fromDate = 'From date is required';
        if (!toDate) newErrors.toDate = 'To date is required';
        if (fromDate && toDate && fromDate > toDate) {
            newErrors.toDate = 'To date must be after from date';
        }
        if (!selectedTrainee) newErrors.selectedTrainee = 'Trainee selection is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const savePlan = () => {
        if (!validateForm()) return;

        const workoutPlanData = {
            name: planName,
            description: description,
            fromDate: fromDate,
            toDate: toDate,
            trainerId: trainerId,
            traineeEmail: selectedTrainee,
            workouts: Object.entries(plan).map(([day, exercises]) => ({
                name: day,
                exercises: exercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps
                }))
            }))
        };

        fetch('/workoutplans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workoutPlanData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="flex flex-col gap-4 p-5">
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Plan Name"
                    value={planName}
                    onChange={handlePlanNameChange}
                    className="p-2 border rounded"
                />
                {errors.planName && <span className="text-red-500 text-sm">{errors.planName}</span>}
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    className="p-2 border rounded"
                />
                {errors.fromDate && <span className="text-red-500 text-sm">{errors.fromDate}</span>}
                <input
                    type="date"
                    placeholder="To Date"
                    value={toDate}
                    onChange={handleToDateChange}
                    className="p-2 border rounded"
                />
                {errors.toDate && <span className="text-red-500 text-sm">{errors.toDate}</span>}
                <select
                    value={selectedTrainee}
                    onChange={handleTraineeChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Trainee</option>
                    {trainees.map((trainee) => (
                        <option key={trainee.email} value={trainee.email}>
                            {trainee.name}
                        </option>
                    ))}
                </select>
                {errors.selectedTrainee && <span className="text-red-500 text-sm">{errors.selectedTrainee}</span>}
                <button onClick={savePlan} className="p-2 bg-blue-500 text-white rounded">
                    Save Plan
                </button>
                <button onClick={clearPlan} className="p-2 bg-blue-500 text-white rounded">
                    Clear
                </button>
            </div>
            <div className="flex gap-4">
                <div
                    className="w-1/8 p-4 bg-blue-100 rounded shadow"
                    onDragOver={onDragOver}
                >
                    <h2 className="text-lg font-bold mb-4">Available Exercises</h2>
                    <ul className="space-y-2">
                        {exercises.map((item) => (
                            <li
                                key={item.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, item, 'available')}
                                className="cursor-move p-2 bg-gray-300 rounded shadow"
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full p-4 bg-blue-100 rounded shadow h-screen">
                    <h2 className="text-lg font-bold mb-4">Your Workout Plan</h2>
                    <div className="grid grid-cols-7 gap-4">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="p-4 rounded"
                                onDragOver={onDragOver}
                                onDrop={(e) => onDropToDay(e, day)}
                            >
                                <h3 className="font-bold">{day}</h3>
                                <ul className="space-y-2">
                                    {plan[day].map((exercise) => (
                                        <li
                                            key={`${exercise.id}-${day}`}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, exercise, 'day', day)}
                                            className="flex justify-between items-center p-2 bg-gray-300 rounded shadow"
                                        >
                                            {exercise.name}
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    min="1"
                                                    value={exercise.sets}
                                                    onChange={(e) => handleExerciseChange(day, exercise.id, 'sets', e.target.value)}
                                                    className="w-8 p-1 rounded border mx-2"
                                                    placeholder="Sets"
                                                />
                                                <input
                                                    type="text"
                                                    min="1"
                                                    value={exercise.reps}
                                                    onChange={(e) => handleExerciseChange(day, exercise.id, 'reps', e.target.value)}
                                                    className="w-8 p-1 rounded border"
                                                    placeholder="Reps"
                                                />
                                                <button
                                                    onClick={() => removeExerciseFromDay(day, exercise.id)}
                                                    className="ml-2 bg-red-500 text-white p-1 rounded"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutBuilder;
