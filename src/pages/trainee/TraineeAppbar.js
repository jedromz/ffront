import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, ChartBarIcon, CogIcon, PhotographIcon, UserIcon, ScaleIcon } from '@heroicons/react/outline'; // Adjusted icons
import { useParams } from 'react-router-dom';
export default function TraineeAppbar() {
    const { traineeId } = useParams();

    return (
        <div className="bg-gray-800 text-white w-20 h-screen p-4 flex flex-col justify-between items-center">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-extrabold pb-5">Fitflow</span>
                    <Link to={`/trainee/${traineeId}/workoutplans`} className="hover:text-gray-300 flex flex-col items-center">
                        <UsersIcon className="h-6 w-6" />
                        <span className="text-xs">Training Plan</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Link to={`/trainee/${traineeId}/workoutplans/current`} className="hover:text-gray-300 flex flex-col items-center">
                        <ClipboardListIcon className="h-6 w-6" />
                        <span className="text-xs">Current Plan</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Link to={`/trainee/${traineeId}/reports`} className="hover:text-gray-300 flex flex-col items-center">
                        <ChartBarIcon className="h-6 w-6" />
                        <span className="text-xs">Reports</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Link to={`/trainee/${traineeId}/measurements`} className="hover:text-gray-300 flex flex-col items-center">
                        <ScaleIcon className="h-6 w-6" />
                        <span className="text-xs">Measurements</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Link to={`/trainee/${traineeId}/photos`} className="hover:text-gray-300 flex flex-col items-center">
                        <PhotographIcon className="h-6 w-6" />
                        <span className="text-xs">Photos</span>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Link to={`/trainee/${traineeId}/trainer`} className="hover:text-gray-300 flex flex-col items-center">
                        <UserIcon className="h-6 w-6" />
                        <span className="text-xs">Trainer</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
