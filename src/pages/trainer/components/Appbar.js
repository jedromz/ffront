import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, ChartBarIcon} from '@heroicons/react/outline'; // Adjusted icons

export default function Appbar() {
    return (
        <div className="bg-gray-800 text-white w-20 h-screen p-4 flex flex-col justify-between items-center">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-extrabold pb-5">Fitflow</span>
                    <Link to="/trainer/123/dashboard" className="hover:text-gray-300">
                        <HomeIcon className="h-6 w-6" />
                    </Link>
                    <span className="text-xs">Home</span>
                </div>
                <div className="flex flex-col items-center">
                    <Link to="/trainees" className="hover:text-gray-300">
                        <UsersIcon className="h-6 w-6" /> {/* Adjusted for Trainees */}
                    </Link>
                    <span className="text-xs">Trainees</span>
                </div>
                <div className="flex flex-col items-center">
                    <Link to="/sessions" className="hover:text-gray-300">
                        <ClipboardListIcon className="h-6 w-6" /> {/* Sessions or Workouts */}
                    </Link>
                    <span className="text-xs">Sessions</span>
                </div>
                <div className="flex flex-col items-center">
                    <Link to="/progress" className="hover:text-gray-300">
                        <ChartBarIcon className="h-6 w-6" /> {/* Progress Reports */}
                    </Link>
                    <span className="text-xs">Progress</span>
                </div>
                <div className="flex flex-col items-center">
                    <Link to="/settings" className="hover:text-gray-300">
                        <ChartBarIcon className="h-6 w-6" /> {/* Settings */}
                    </Link>
                    <span className="text-xs">Settings</span>
                </div>
            </div>
        </div>
    );
}
