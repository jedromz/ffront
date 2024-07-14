import React from 'react';
import IconTile from '../trainer/components/IconTile';  // Ensure the correct path is set for components
import TraineeAppbar from './TraineeAppbar';
import { useParams } from 'react-router-dom';

export default function TraineeDashboard() {
    const { traineeId } = useParams();
    return (
        <div className='flex h-screen'>
            <TraineeAppbar />
            <div className="flex flex-col items-center justify-center w-full">
                <div className="grid grid-cols-3 gap-20">
                    <IconTile icon="🏋️" label="Training Plans" to={`/trainee/${traineeId}/workoutplans`}/>
                    <IconTile icon="🏋️" label="Current Training Plan" to={`/trainee/${traineeId}/workoutplans/current`}/>
                    <IconTile icon="✉️" label="Reports" to={`/trainee/${traineeId}/reports`}/>
                    <IconTile icon="📏" label="Measurements" to={`/trainee/${traineeId}/measurements`}/>
                    <IconTile icon="📷" label="Photos" to={`/trainee/${traineeId}/photos`}/>
                    <IconTile icon="👨‍🏫" label="Trainer" to={`/trainee/${traineeId}/trainer`}/>
                </div>
            </div>
        </div>
    );
}
