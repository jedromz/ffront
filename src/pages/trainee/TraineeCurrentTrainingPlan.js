import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../trainer/components/Appbar';
import TraineeAppbar from './TraineeAppbar';

export default function TraineeTrainingPlan() {
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [progressions, setProgressions] = useState({});
    const { traineeId } = useParams();

    useEffect(() => {
        fetch(`/api/trainees/${traineeId}/trainingplans/current`)
            .then(response => response.json())
            .then(data => setTrainingPlan(data))
            .catch(error => console.error('Error fetching training plan:', error));
    }, [traineeId]);

    useEffect(() => {
        if (trainingPlan) {
            trainingPlan.exercies.forEach(exercise => {
                fetch(`/trainees/${traineeId}/progressions/${exercise.name}`)
                    .then(response => response.json())
                    .then(data => {
                        setProgressions(prevState => ({
                            ...prevState,
                            [exercise.name]: data
                        }));
                    })
                    .catch(error => console.error(`Error fetching progression for ${exercise.name}:`, error));
            });
        }
    }, [trainingPlan, traineeId]);

    const handleProgressionChange = (exerciseName, field, value) => {
        if (value >= 0) {
            setProgressions(prevState => ({
                ...prevState,
                [exerciseName]: {
                    ...prevState[exerciseName],
                    [field]: value
                }
            }));
        }
    };

    const handleFormSubmit = (e, exerciseName) => {
        e.preventDefault();
        const { sets, reps, weight } = progressions[exerciseName];
        fetch(`/trainees/${traineeId}/progressions/${exerciseName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sets, reps, weight })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Progressions saved:', data);
                fetch(`/trainees/${traineeId}/progressions/${exerciseName}`)
                    .then(response => response.json())
                    .then(data => {
                        setProgressions(prevState => ({
                            ...prevState,
                            [exerciseName]: data
                        }));
                    })
                    .catch(error => console.error(`Error fetching progression for ${exerciseName}:`, error));
            })
            .catch(error => console.error('Error saving progressions:', error));
    };

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    return (
        <div className="flex h-screen">
           <TraineeAppbar/>
            <div className="overflow-x-auto w-full p-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Training Plan</h1>
                    {trainingPlan ? (
                        trainingPlan.exercies.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-center">{trainingPlan.name}</h2>
                                <p className="mb-6 text-center">{trainingPlan.description}</p>
                                {daysOfWeek.map(day => (
                                    <div key={day} className="mb-8">
                                        <h3 className="text-lg font-semibold mb-2">{day}</h3>
                                        <ul>
                                            {trainingPlan.exercies.filter(exercise => exercise.dayOfWeek === day).sort((a, b) => a.exerciseOrder - b.exerciseOrder).map(exercise => (
                                                <li key={exercise.name} className="mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="w-1/4">{exercise.name}</span>
                                                        <form className="flex space-x-2 w-3/4" onSubmit={(e) => handleFormSubmit(e, exercise.name)}>
                                                            <input
                                                                type="number"
                                                                placeholder="Sets"
                                                                value={progressions[exercise.name]?.sets || ''}
                                                                onChange={(e) => handleProgressionChange(exercise.name, 'sets', e.target.value)}
                                                                className="border rounded py-1 px-2 w-1/3"
                                                                min="0"
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Reps"
                                                                value={progressions[exercise.name]?.reps || ''}
                                                                onChange={(e) => handleProgressionChange(exercise.name, 'reps', e.target.value)}
                                                                className="border rounded py-1 px-2 w-1/3"
                                                                min="0"
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Weight"
                                                                value={progressions[exercise.name]?.weight || ''}
                                                                onChange={(e) => handleProgressionChange(exercise.name, 'weight', e.target.value)}
                                                                className="border rounded py-1 px-2 w-1/3"
                                                                min="0"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="px-4 py-1 bg-blue-600 text-white rounded"
                                                            >
                                                                Save
                                                            </button>
                                                        </form>
                                                    </div>
                                                    {progressions[exercise.name] && (
                                                        <div className="mt-2 text-gray-600 text-sm">
                                                            <p>Last Progression - Sets: {progressions[exercise.name].sets}, Reps: {progressions[exercise.name].reps}, Weight: {progressions[exercise.name].weight}</p>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">No exercises in the training plan.</p>
                        )
                    ) : (
                        <p className="text-center">Loading training plan...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
