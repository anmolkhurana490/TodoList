import { useState, useEffect, useMemo } from "react";
import TaskAPI from "../services/TaskAPI";
import UserAPI from "../services/UserAPI";

const useOverviewViewModel = () => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const { getTasksApi } = TaskAPI;

    // Initial fetch tasks
    useEffect(() => {
        fetchTasks();
    }, [])

    const fetchTasks = async () => {
        const data = await getTasksApi();
        if (!data) return;

        // Sort by due date ascending
        const pending = data
            .filter(t => !t.completed)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setPendingTasks(pending);
    };

    const [teamMembers, setTeamMembers] = useState([]);
    const { getAllUsersApi } = UserAPI;

    // Initial fetch team members
    useEffect(() => {
        fetchTeamMembers();
    }, [])

    const fetchTeamMembers = async () => {
        const data = await getAllUsersApi();
        if (!data) return;

        // Set team members
        setTeamMembers(data);
    };

    return {
        pendingTasks, teamMembers
    };
}

export default useOverviewViewModel;