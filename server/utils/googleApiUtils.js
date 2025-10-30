import axios from 'axios';

export const addTaskToCalender = async (task, accessToken) => {
    const event = formatEvent(task);

    try {
        const response = await axios.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            event,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error adding event to Google Calendar:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const updateTaskToCalender = async (task, accessToken) => {
    const event = formatEvent(task);

    try {
        const response = await axios.patch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(task.eventId)}`,
            event,
            { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating event to Google Calendar:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const formatEvent = (task) => {
    const startDate = new Date(task.dueDate);
    const endDate = new Date(startDate + 24 * 60 * 60 * 1000); // Assuming a 1-day event

    return {
        summary: task.title,
        description: task.description,
        start: {
            dateTime: startDate.toISOString(),
            timeZone: 'UTC',
        },
        end: {
            // Assuming a 1-day event
            dateTime: endDate.toISOString(),
            timeZone: 'UTC',
        },
    };
}