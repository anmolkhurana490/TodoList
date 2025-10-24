import React, { useState, useMemo, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { createTask, updateTask, deleteTask, getTasks } from './handlers';

const formatDateDisplay = (iso) => iso ? new Date(iso).toLocaleDateString() : "—";

const TodoList = () => {
    const [tasks, setTasks] = useState([]);

    const [statusFilter, setStatusFilter] = useState("All"); // All | Pending | Completed
    const [dueDateFilter, setDueDateFilter] = useState(""); // yyyy-mm-dd or empty
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await getTasks();
            // Sort by due date ascending
            if (data) setTasks(data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        };
        fetchTasks();
    }, [])

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
    });

    // Edit modal state
    const [editing, setEditing] = useState(null); // task object or null

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

    const openEdit = (task) => {
        setEditing(task.id);
        setForm({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            completed: task.completed,
        });
    };

    const openNew = () => {
        setEditing("new");
        setForm({
            title: "",
            description: "",
            dueDate: "",
            completed: false,
        });
    };

    const saveEdit = async () => {
        if (!form.title.trim() || !form.dueDate) {
            setError("Title and Due Date are required.");
            return;
        }

        if (editing === "new") {
            const data = await createTask(form);
            if (data) setTasks([{ id: data.id, ...form }, ...tasks]);
            else return setError("Failed to create task.");
        } else {
            const data = await updateTask(editing, form);
            if (data) setTasks(tasks.map((t) => (t.id === editing ? { ...t, ...form } : t)));
            else return setError("Failed to update task.");
        }

        closeEditor();
        setError(null);
    };

    const toggleComplete = async (id) => {
        const task = tasks.find((t) => t.id === id);
        const data = await updateTask(id, { ...task, completed: !task.completed });
        if (data) setTasks(tasks.map(t => (t.id === id ? data : t)));
    };

    const closeEditor = () => {
        setEditing(null);
        setForm({ title: "", description: "", dueDate: "", completed: false });
    };

    const removeTask = async (id) => {
        if (!confirm("Delete this task?")) return;
        const deleted = await deleteTask(id);

        if (deleted) setTasks(tasks.filter((t) => t.id !== id));
        else setError("Failed to delete task.");
    };

    return (
        <div className="todo-list-container bg-linear-to-br from-blue-100 to-indigo-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                        Beautiful Todo List
                    </h1>

                    <div className="flex gap-3 items-center">
                        <button
                            onClick={openNew}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
                        >
                            <FiPlus />
                            New Task
                        </button>
                    </div>
                </header>

                <section className="bg-white shadow rounded-lg p-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
                        <div className="flex gap-3 flex-1">
                            <div className="flex items-center bg-slate-50 rounded px-3 py-2 gap-2">
                                <FiSearch className="text-slate-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search title or description..."
                                    className="bg-transparent outline-none text-slate-700"
                                />
                                {query && (
                                    <button
                                        className="ml-2 text-slate-400 hover:text-slate-700"
                                        onClick={() => setQuery("")}
                                        aria-label="clear"
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded border bg-white"
                            >
                                <option>All</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>

                            <input
                                type="date"
                                value={dueDateFilter}
                                onChange={(e) => setDueDateFilter(e.target.value)}
                                className="px-3 py-2 rounded border bg-white"
                                title="Filter by due date (show tasks due on or before)"
                            />

                            <button
                                onClick={() => {
                                    setStatusFilter("All");
                                    setDueDateFilter("");
                                    setQuery("");
                                }}
                                className="px-3 py-2 rounded border bg-slate-50"
                                title="Reset filters"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-700">{filtered.length}</span> of{" "}
                            <span className="font-medium text-slate-700">{tasks.length}</span> tasks
                        </div>
                    </div>

                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-[2fr_3fr_1fr_1fr_40px] gap-2 text-slate-600 text-sm font-medium border-b pb-2 mb-2">
                        <div>Title</div>
                        <div>Description</div>
                        <div>Due Date</div>
                        <div>Completed</div>
                        <div className="sr-only">Actions</div>
                    </div>

                    {/* List */}
                    <ul className="space-y-3">
                        {filtered.map((t) => (
                            <li
                                key={t.id}
                                className="bg-white border rounded-lg shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">{t.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 hidden sm:block">
                                                {t.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                            <div className="text-sm text-slate-500 sm:text-right">
                                                <div className="font-medium text-slate-800">
                                                    {formatDateDisplay(t.dueDate)}
                                                </div>
                                                <div className="text-xs mt-1">
                                                    {t.completed ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleComplete(t.id)}
                                                    className={`px-3 py-1 rounded text-sm font-medium ${t.completed
                                                        ? "bg-green-50 text-green-700 border border-green-100"
                                                        : "bg-yellow-50 text-yellow-800 border border-yellow-100"
                                                        }`}
                                                >
                                                    {t.completed ? "Mark Pending" : "Mark Done"}
                                                </button>

                                                <button
                                                    onClick={() => openEdit(t)}
                                                    className="p-2 rounded text-indigo-600 hover:bg-indigo-50"
                                                    title="Edit"
                                                >
                                                    <FiEdit />
                                                </button>

                                                <button
                                                    onClick={() => removeTask(t.id)}
                                                    className="p-2 rounded text-red-600 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile description */}
                                    <p className="text-sm text-slate-500 mt-3 sm:hidden">{t.description}</p>
                                </div>
                            </li>
                        ))}

                        {filtered.length === 0 && (
                            <li className="text-center text-slate-500 py-8">No tasks match your filters.</li>
                        )}
                    </ul>
                </section>
            </div>

            {/* Edit/New Modal */}
            {editing && <EditCreateModal
                form={form}
                setForm={setForm}
                onClose={closeEditor}
                onSave={saveEdit}
                erorr={error}
                isNew={editing === "new"}
            />}
        </div>
    );
};

// Edit/Create Modal Component
const EditCreateModal = ({ form, setForm, onSave, onClose, error, isNew }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {isNew === "new" ? "Create Task" : "Edit Task"}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <FiX />
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Title</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border rounded"
                            placeholder="Task title"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border rounded"
                            rows={3}
                            placeholder="Describe the task..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-slate-700">Due date</label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="mt-1 w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.completed}
                                    onChange={(e) => setForm({ ...form, completed: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                Completed
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded border bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="px-4 py-2 rounded bg-indigo-600 text-white"
                        >
                            Save
                        </button>
                    </div>
                    {error && (<div className="text-red-600 text-sm mt-2">{error}</div>)}
                </div>
            </div>
        </div>
    );
}

export default TodoList;
