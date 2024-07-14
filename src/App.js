import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import TraineeList from './pages/trainer/trainees/TraineeList'
import Dashboard from './pages/trainer/dashboard/Dashboard'
import MentorshipsList from './pages/trainer/mentorships/MentorshipsList'
import WorkoutsList from './pages/trainer/workouts/WorkoutsList'
import Exercises from './pages/trainer/exercises/Exercises'
import Reports from './pages/trainer/reports/Reports'
import WorkoutBuilder from './pages/trainer/workouts/WorkoutBuilder'
import TraineeDashboard from './pages/trainee/TraineeDashboard';
import TraineesMeasurements from './pages/trainee/TraineeMeasurements';
import TraineeWorkoutsList from './pages/trainee/TraineeWorkouts';
import TraineeReports from './pages/trainee/TraineeReports';
import TraineesPhotos from './pages/trainee/TraineePhotos';
import TraineeCurrentTrainer from './pages/trainee/TraineeCurrentTrainer';
import TraineeTrainingPlan from './pages/trainee/TraineeCurrentTrainingPlan';
import Login from './pages/auth/Login';
import { useState } from 'react';
import PrivateRoutes from './PrivateRoutes';
import SignInWithToken from './pages/auth/SignInWithToken';
import RegisterTrainer from './pages/trainer/RegisterTrainer';
import EnterTraineeDetails from './pages/trainee/EnterTraineeDetails';
export default function App() {
    const [cookie, setCookie] = useState(null);
    return (
        <div>
            <Routes>
                <Route path="/sign-in" element={<SignInWithToken />} />
                <Route path="/" element={<PrivateRoutes />} >
                <Route element={<TraineeList/>} path="/" exact/>
                <Route element={<TraineeList/>} path="/products"/>
                 </Route>
                <Route path="/login" element={<Login setCookie={setCookie} />} />

                <Route path="/register/trainer" element={<RegisterTrainer />} />
                <Route path="/trainer/:trainerId/trainees" element={<TraineeList />} />
                <Route path="/trainer/:trainerId/dashboard" element={<Dashboard />} />
                <Route path="/trainer/:trainerId/mentorships" element={<MentorshipsList />} />
                <Route path="/trainer/:trainerId/workouts" element={<WorkoutsList />} />
                <Route path="/trainer/:trainerId/reports" element={<Reports/>} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/trainer/:trainerId/builder" element={<WorkoutBuilder />} />
                
                <Route path="/trainee/:traineeId/dashboard" element={<TraineeDashboard />} />
                <Route path="/trainee/:traineeId/measurements" element={<TraineesMeasurements id={1} />} />
                <Route path="/trainee/:traineeId/workoutplans" element={<TraineeWorkoutsList id={1} />} />
                <Route path="/trainee/:traineeId/reports" element={<TraineeReports id={1} />} />
                <Route path="/trainee/:traineeId/photos" element={<TraineesPhotos id={1} />} />
                <Route path="/trainee/:traineeId/trainer" element={<TraineeCurrentTrainer/>} />
                <Route path="/trainee/:traineeId/workoutplans/current" element={<TraineeTrainingPlan  />} />
                <Route path="/trainee/:traineeId/enter/details" element={<EnterTraineeDetails  />} />
            </Routes>
        </div>
    );
}
