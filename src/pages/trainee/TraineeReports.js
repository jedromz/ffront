import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Appbar from '../trainer/components/Appbar';
import TraineeAppbar from './TraineeAppbar';

export default function TraineeReports() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add New Report Modal
    const { traineeId } = useParams();
    const [photoUrls, setPhotoUrls] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        fetch(`/trainees/${traineeId}/reports`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setReports(data);
                return data;
            })
            .then(reports => {
                const photoPromises = reports.map(report =>
                    report.photos.map(photoId =>
                        fetch(`/objects/${photoId}`)
                            .then(response => response.text())
                            .then(url => ({ [photoId]: url }))
                    )
                );
                return Promise.all(photoPromises.flat());
            })
            .then(photoData => {
                const urls = photoData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setPhotoUrls(urls);
            })
            .catch(error => {
                console.error('There was a problem fetching the reports or photo URLs:', error);
            });
    }, [traineeId]);

    const handleReportClick = async (reportId) => {
        setSelectedReport(reports.find(report => report.id === reportId));
        setIsModalOpen(true);
        await fetchComments(reportId);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setComments([]);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const fetchComments = async (reportId) => {
        try {
            const response = await fetch(`/reports/${reportId}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const addComment = async () => {
        const text = newComment;
        const reportId = selectedReport.id;

        try {
            const response = await fetch('/reports/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    traineeId,
                    trainerId: 1000, // Adjust as needed
                    text,
                    reportId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            await fetchComments(reportId);
            setNewComment('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddReport = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const title = formData.get('title');
        const content = formData.get('content');
        const date = formData.get('date');

        // Validation
        if (!title || !content || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        fetch(`/trainees/${traineeId}/report`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(newReport => {
            fetch(`/trainees/${traineeId}/reports`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setReports(data);
                    const photoPromises = data.map(report =>
                        report.photos.map(photoId =>
                            fetch(`/objects/${photoId}`)
                                .then(response => response.text())
                                .then(url => ({ [photoId]: url }))
                        )
                    );
                    return Promise.all(photoPromises.flat());
                })
                .then(photoData => {
                    const urls = photoData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                    setPhotoUrls(urls);
                })
                .catch(error => {
                    console.error('There was a problem fetching the reports or photo URLs:', error);
                });

            closeAddModal();
        })
        .catch(error => {
            console.error('There was a problem adding the report:', error);
        });
    };

    return (
        <div className="flex h-screen">
            <TraineeAppbar/>
            <div className="overflow-x-auto w-full">
                <div className="m-5">
                    <h1 className="text-xl font-semibold mb-4">Reports</h1>
                    <button onClick={openAddModal} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Add New Report</button>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Date</th>
                                    <th scope="col" className="py-3 px-6">Title</th>
                                    <th scope="col" className="py-3 px-6">Content</th>
                                    <th scope="col" className="py-3 px-6">Photos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => handleReportClick(report.id)}>
                                        <td className="py-4 px-6">{report.date}</td>
                                        <td className="py-4 px-6">{report.title}</td>
                                        <td className="py-4 px-6">{report.content}</td>
                                        <td className="py-4 px-6">
                                            {report.photos && report.photos.length > 0 && photoUrls[report.photos[0]] ? (
                                                <div className="relative">
                                                    <img src={photoUrls[report.photos[0]]} alt="Report Thumbnail" className="w-10 h-10 object-cover" />
                                                    {report.photos.length > 1 && (
                                                        <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1">{report.photos.length - 1}+</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>No Photos</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && selectedReport && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedReport.title}</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">{selectedReport.content}</p>
                                        <div className="mt-4">
                                            {selectedReport.photos && selectedReport.photos.length > 0 && selectedReport.photos.map(photoId => (
                                                photoUrls[photoId] && (
                                                    <img key={photoId} src={photoUrls[photoId]} alt="Report Photo" className="mb-2 max-w-full h-auto" />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <textarea
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            rows="4"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                        ></textarea>
                                        <button onClick={addComment} className="mt-2 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            Add Comment
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold">Comments</h4>
                                        <ul>
                                            {comments.map(comment => (
                                                <li key={comment.id} className="mt-2 p-2 border-b">
                                                    <p className="text-sm">{comment.text}</p>
                                                    <small className="text-gray-500">- {comment.trainerName} ({comment.trainerEmail})</small>
                                                </li>
                                            ))}
                                        </ul>
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

                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeAddModal}>
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                                <div className="mt-3 text-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Report</h3>
                                    <form className="mt-2" onSubmit={handleAddReport}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                                                Date
                                            </label>
                                            <input 
                                                type="date" 
                                                name="date" 
                                                id="date" 
                                                defaultValue={getTodayDate()}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                required 
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                Title
                                            </label>
                                            <input type="text" name="title" id="title" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                                Content
                                            </label>
                                            <textarea name="content" id="content" rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
                                                Photos
                                            </label>
                                            <input type="file" name="files" id="files" multiple className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                        </div>
                                        <div className="items-center px-4 py-3">
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                Add Report
                                            </button>
                                        </div>
                                    </form>
                                    <div className="items-center px-4 py-3">
                                        <button onClick={closeAddModal} className="px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
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
