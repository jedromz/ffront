import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../trainer/components/Appbar';
import TraineeAppbar from './TraineeAppbar';

export default function TraineesMeasurements() {
    const [measurements, setMeasurements] = useState([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [unit, setUnit] = useState('CM');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const { traineeId } = useParams();

    useEffect(() => {
        fetchMeasurements();
    }, [traineeId]);

    const fetchMeasurements = () => {
        fetch(`/trainees/${traineeId}/measurements`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const groupedMeasurements = data.reduce((acc, measurement) => {
                    const { date, bodyPart, measurement: { measurementValue, unit } } = measurement;
                    if (!acc[date]) acc[date] = {};
                    acc[date][bodyPart] = { measurementValue, unit };
                    return acc;
                }, {});
                setMeasurements(groupedMeasurements);
            })
            .catch(error => {
                console.error('There was a problem fetching the measurements:', error);
            });
    };

    const handleMeasurementClick = (date) => {
        setSelectedMeasurement(measurements[date]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openFormModal = () => {
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
    };

    const validateMeasurements = (measurements) => {
        for (const measurement of measurements) {
            if (measurement.measurement.measurementValue < 0) {
                return false;
            }
        }
        return true;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newMeasurements = [
            'WEIGHT', 'SHOULDERS', 'CHEST', 'RIGHT_ARM', 'LEFT_ARM', 'WAIST',
            'HIPS', 'RIGHT_THIGH', 'LEFT_THIGH', 'RIGHT_CALF', 'LEFT_CALF'
        ].map(bodyPart => ({
            date: formData.get('date'),
            bodyPart,
            measurement: {
                measurementValue: parseFloat(formData.get(`${bodyPart.toLowerCase().replace(/_/g, '')}Value`)),
                unit: formData.get(`${bodyPart.toLowerCase().replace(/_/g, '')}Unit`)
            }
        }));

        if (!validateMeasurements(newMeasurements)) {
            alert("Measurement values cannot be negative");
            return;
        }

        const payload = {
            measurements: newMeasurements
        };

        fetch(`/trainees/${traineeId}/measurements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            fetchMeasurements();
            closeFormModal();
        })
        .catch(error => {
            console.error('There was a problem adding the measurements:', error);
        });
    };

    const handleUnitChange = (newUnit) => {
        setUnit(newUnit);
        const unitSelects = document.querySelectorAll('select[name$="Unit"]');
        unitSelects.forEach(select => {
            select.value = newUnit;
        });
    };

    return (
        <div className="flex h-screen">
            <TraineeAppbar/>
            <div className="overflow-x-auto w-full">
                <div className="m-5">
                    <h1 className="text-xl font-semibold mb-4">Trainee Measurements</h1>
                    <button onClick={openFormModal} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Add New Measurements</button>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Date</th>
                                    <th scope="col" className="py-3 px-6">Weight</th>
                                    <th scope="col" className="py-3 px-6">Shoulders</th>
                                    <th scope="col" className="py-3 px-6">Chest</th>
                                    <th scope="col" className="py-3 px-6">Right Arm</th>
                                    <th scope="col" className="py-3 px-6">Left Arm</th>
                                    <th scope="col" className="py-3 px-6">Waist</th>
                                    <th scope="col" className="py-3 px-6">Hips</th>
                                    <th scope="col" className="py-3 px-6">Right Thigh</th>
                                    <th scope="col" className="py-3 px-6">Left Thigh</th>
                                    <th scope="col" className="py-3 px-6">Right Calf</th>
                                    <th scope="col" className="py-3 px-6">Left Calf</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(measurements).map(([date, parts]) => (
                                    <tr key={date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => handleMeasurementClick(date)}>
                                        <td className="py-4 px-6">{date}</td>
                                        <td className="py-4 px-6">{parts.WEIGHT?.measurementValue || ''} {parts.WEIGHT?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.SHOULDERS?.measurementValue || ''} {parts.SHOULDERS?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.CHEST?.measurementValue || ''} {parts.CHEST?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.RIGHT_ARM?.measurementValue || ''} {parts.RIGHT_ARM?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.LEFT_ARM?.measurementValue || ''} {parts.LEFT_ARM?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.WAIST?.measurementValue || ''} {parts.WAIST?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.HIPS?.measurementValue || ''} {parts.HIPS?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.RIGHT_THIGH?.measurementValue || ''} {parts.RIGHT_THIGH?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.LEFT_THIGH?.measurementValue || ''} {parts.LEFT_THIGH?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.RIGHT_CALF?.measurementValue || ''} {parts.RIGHT_CALF?.unit || ''}</td>
                                        <td className="py-4 px-6">{parts.LEFT_CALF?.measurementValue || ''} {parts.LEFT_CALF?.unit || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && selectedMeasurement && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Measurement Details</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Date: {Object.keys(selectedMeasurement)[0]}</p>
                                        {Object.entries(selectedMeasurement).map(([bodyPart, { measurementValue, unit }]) => (
                                            <p key={bodyPart} className="text-sm text-gray-500">{bodyPart.replace('_', ' ')}: {measurementValue} {unit}</p>
                                        ))}
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

                    {isFormModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeFormModal}>
                            <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Measurements</h3>
                                    <form className="mt-2 grid grid-cols-2 gap-4" onSubmit={handleFormSubmit}>
                                        <div className="col-span-2 mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                id="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        {[
                                            { label: 'Weight', id: 'weight', unitOptions: ['KG'] },
                                            { label: 'Shoulders', id: 'shoulders', unitOptions: ['CM'] },
                                            { label: 'Chest', id: 'chest', unitOptions: ['CM'] },
                                            { label: 'Right Arm', id: 'rightarm', unitOptions: ['CM'] },
                                            { label: 'Left Arm', id: 'leftarm', unitOptions: ['CM'] },
                                            { label: 'Waist', id: 'waist', unitOptions: ['CM'] },
                                            { label: 'Hips', id: 'hips', unitOptions: ['CM'] },
                                            { label: 'Right Thigh', id: 'rightthigh', unitOptions: ['CM'] },
                                            { label: 'Left Thigh', id: 'leftthigh', unitOptions: ['CM'] },
                                            { label: 'Right Calf', id: 'rightcalf', unitOptions: ['CM'] },
                                            { label: 'Left Calf', id: 'leftcalf', unitOptions: ['CM'] }
                                        ].map(({ label, id, unitOptions }) => (
                                            <div key={id} className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`${id}Value`}>
                                                    {label}
                                                </label>
                                                <div className="flex">
                                                    <input type="number" step="0.1" min="0" name={`${id}Value`} id={`${id}Value`} className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                                    <select name={`${id}Unit`} id={`${id}Unit`} value={unit} onChange={(e) => handleUnitChange(e.target.value)} className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2" required>
                                                        {unitOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-span-2 items-center px-4 py-3">
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                Add Measurements
                                            </button>
                                        </div>
                                    </form>
                                    <div className="col-span-2 items-center px-4 py-3">
                                        <button onClick={closeFormModal} className="px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
