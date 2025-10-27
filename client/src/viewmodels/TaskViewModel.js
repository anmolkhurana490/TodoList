import { useState, useEffect, useMemo } from "react";
import taskApi from "./taskAPI.js";

const useTaskViewModel = () => {
    const [tasks, setTasks] = useState([]);
    const { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } = taskApi;

    const [statusFilter, setStatusFilter] = useState("All"); // All | Pending | Completed
    const [dueDateFilter, setDueDateFilter] = useState(""); // yyyy-mm-dd or empty
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);

    // Initial fetch tasks
    useEffect(() => {
        fetchTasks();
    }, [])

    const fetchTasks = async () => {
        const data = await getTasksApi();
        // Sort by due date ascending
        if (data) setTasks(data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    };

    // Derived filtered list
    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            const statusMatches =
                statusFilter === "All" ||
                (statusFilter === "Completed" && t.completed) ||
                (statusFilter === "Pending" && !t.completed);

            const dueMatches =
                !dueDateFilter ||
                new Date(t.dueDate) <= new Date(dueDateFilter + "T23:59:59");

            const queryMatches =
                !query ||
                t.title.toLowerCase().includes(query.toLowerCase()) ||
                t.description.toLowerCase().includes(query.toLowerCase());

            return statusMatches && dueMatches && queryMatches;
        });
    }, [tasks, statusFilter, dueDateFilter, query]);

    const applyFilters = (status, dueDate, query) => {
        setStatusFilter(status);
        setDueDateFilter(dueDate);
        setQuery(query);
    };

    const getFilters = () => {
        return {
            status: statusFilter,
            dueDate: dueDateFilter,
            query: query,
        };
    };

    const clearFilters = () => {
        setStatusFilter("All");
        setDueDateFilter("");
        setQuery("");
    };

    const createTask = async (form) => {
        if (!form.title.trim() || !form.dueDate) {
            setError("Title and Due Date are required.");
            return false;
        }

        const data = await createTaskApi(form);

        if (data) {
            setTasks([{ id: data.id, ...form }, ...tasks]);
            setError(null);
            return true;
        }
        else {
            setError("Failed to create task.");
            return false;
        }
    };

    const updateTask = async (id, form) => {
        if (!form.title.trim() || !form.dueDate) {
            setError("Title and Due Date are required.");
            return false;
        }

        const data = await updateTaskApi(id, form);

        if (data) {
            setTasks(tasks.map((t) => (t.id === id ? { ...t, ...form } : t)));
            setError(null);
            return true;
        }
        else {
            setError("Failed to update task.");
            return false;
        }
    };

    const toggleCompleteTask = async (id) => {
        const task = tasks.find((t) => t.id === id);
        const data = await updateTaskApi(id, { ...task, completed: !task.completed });
        if (data) setTasks(tasks.map(t => (t.id === id ? data : t)));
    };

    const removeTask = async (id) => {
        if (!confirm("Delete this task?")) return;
        const deleted = await deleteTaskApi(id);

        if (deleted) setTasks(tasks.filter((t) => t.id !== id));
        else setError("Failed to delete task.");
    };

    return {
        tasks, filtered, error,
        applyFilters, getFilters, clearFilters,
        createTask, updateTask, toggleCompleteTask, removeTask
    };
}

export default useTaskViewModel;