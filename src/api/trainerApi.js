
import axios from 'axios';

export const getTrainerMentorships = async (trainerId) => {
    try {
        const response = await axios.get(`/${trainerId}/mentorships`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch mentorships:', error);
        throw error;
    }
};

export const getTrainerTrainees = async (trainerId) => {
    try {
        const response = await axios.get(`/${trainerId}/trainees`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch trainees:', error);
        throw error;
    }
};
