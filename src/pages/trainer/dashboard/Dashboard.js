import React from 'react';
import NumberTile from '../components/NumberTile';
import IconTile from '../components/IconTile';
import Appbar from '../components/Appbar';
import { useParams } from 'react-router-dom';

export default function Dashboard() {
    const { trainerId } = useParams();
    return (
        <div className='flex h-screen'>
            <Appbar />
            <div className="flex flex-col items-center justify-center w-full">
                <div className="grid grid-cols-3 gap-20">
                    <NumberTile number="1" label="Mentorships" to={`/trainer/${trainerId}/mentorships`} />
                    <IconTile icon="🏋️" label="Workouts" to={`/trainer/${trainerId}/workouts`} />
                    <IconTile icon="👤" label="Trainees" to={`/trainer/${trainerId}/trainees`} />
                    <IconTile icon="✉️" label="Reports" to={`/trainer/${trainerId}/reports`} />
                    <IconTile icon="🔨" label="Plan Builder" to={`/trainer/${trainerId}/builder`} />
                    <IconTile icon="💪" label="Exercises" to="/exercises" />
                </div>
            </div>
        </div>
    );
}
