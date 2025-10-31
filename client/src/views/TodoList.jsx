import React, { useState, useMemo, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { MdMoreVert } from "react-icons/md";
import TaskViewModel from '../viewmodels/TaskViewModel';
import { DatePicker } from 'antd';
import dayjs from 'dayjs'

const formatDateDisplay = (iso) => iso ? new Date(iso).toLocaleDateString() : "—";

const TodoList = ({ user }) => {
    if (!user) return (<></>);

    const {
        filtered, error,
        applyFilters, getFilters,
        createTask, updateTask, toggleCompleteTask, removeTask
    } = TaskViewModel();

    // Edit modal state
    const [editing, setEditing] = useState(null); // task object or null

    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
    });

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
        if (editing === "new") {
            const success = await createTask(form);
            if (success) closeEditor();
        } else {
            const success = await updateTask(editing, form);
            if (success) closeEditor();
        }
    };

    const closeEditor = () => {
        setEditing(null);
        setForm({ title: "", description: "", dueDate: "", completed: false });
    };

    const filters = getFilters();

    // Array of different gradient backgrounds, used to style task cards
    const gradients = [
        'bg-gradient-to-br from-purple-100 to-pink-100',
        'bg-gradient-to-br from-blue-100 to-cyan-100',
        'bg-gradient-to-br from-green-100 to-emerald-100',
        'bg-gradient-to-br from-yellow-100 to-orange-100',
        'bg-gradient-to-br from-red-100 to-rose-100',
        'bg-gradient-to-br from-indigo-100 to-purple-100',
        'bg-gradient-to-br from-teal-100 to-green-100',
        'bg-gradient-to-br from-orange-100 to-red-100'
    ];

    // Opened card more options state
    const [openedCardOp, setOpenedCardOp] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.more-options')) {
                setOpenedCardOp(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="todo-list-container bg-linear-to-br from-blue-100 to-indigo-50 h-full px-4 py-2">
            <HeaderSection
                filters={filters}
                applyFilters={applyFilters}
                openNew={openNew}
            />

            <div className="h-screen flex flex-col">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button className="rounded-lg shadow bg-white px-4 py-1" onClick={() => applyFilters('All', filters.dueDate, filters.query)}>
                        All Tasks
                    </button>
                    <button className="rounded-lg shadow bg-white px-4 py-1" onClick={() => applyFilters('Pending', filters.dueDate, filters.query)}>
                        Pending
                    </button>
                    <button className="rounded-lg shadow bg-white px-4 py-1" onClick={() => applyFilters('Completed', filters.dueDate, filters.query)}>
                        Completed
                    </button>
                </div>

                <section className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex-1 overflow-hidden flex flex-col">

                    {/* Task List - Scrollable */}
                    <div className="flex-1 overflow-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                            {filtered.map(t => {
                                const cardGradient = gradients[Math.floor(Math.random() * gradients.length)];

                                return (
                                    <div
                                        key={t.id}
                                        className={`${cardGradient} relative border border-gray-200 rounded-xl shadow-md p-4 flex flex-col min-h-56 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1 pr-2">
                                                {t.title}
                                            </h3>

                                            <div className="flex items-center gap-2">
                                                {t.completed ? (
                                                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                                                        Done
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-medium whitespace-nowrap">
                                                        Pending
                                                    </span>
                                                )}

                                                <button
                                                    className="more-options text-lg hover:bg-gray-200/50 hover:text-slate-700 rounded-full p-1 transition-colors duration-150"
                                                    onClick={() => setOpenedCardOp(openedCardOp === t.id ? null : t.id)}
                                                >
                                                    <MdMoreVert />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="flex-1 flex flex-col">
                                            <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-1">
                                                {t.description || "No description provided"}
                                            </p>

                                            <div className="text-lg font-semibold text-slate-500 mb-3">
                                                Due: {formatDateDisplay(t.dueDate)}
                                            </div>
                                        </div>

                                        {/* More Options Menu */}
                                        {openedCardOp === t.id && (
                                            <div className="absolute top-12 right-2 bg-white rounded-lg shadow-lg border p-2 z-10 min-w-24">
                                                <button
                                                    onClick={() => {
                                                        openEdit(t);
                                                        setOpenedCardOp(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 rounded text-indigo-700 hover:bg-indigo-50 transition-colors duration-150"
                                                >
                                                    <FiEdit size={14} />
                                                    <span className="text-sm">Edit</span>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        removeTask(t.id);
                                                        setOpenedCardOp(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 rounded text-red-700 hover:bg-red-50 transition-colors duration-150"
                                                >
                                                    <FiTrash2 size={14} />
                                                    <span className="text-sm">Delete</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Toggle Complete Button */}
                                        <button
                                            onClick={() => toggleCompleteTask(t.id)}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${t.completed
                                                ? "bg-green-200 hover:bg-green-300 text-green-800"
                                                : "bg-amber-200 hover:bg-amber-300 text-amber-800"
                                                }`}
                                        >
                                            {t.completed ? "Mark as Pending" : "Mark as Done"}
                                        </button>
                                    </div>
                                );
                            })}

                            {filtered.length === 0 && (
                                <div className="col-span-full text-center text-slate-500 py-12">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-lg font-medium mb-2">No tasks found</p>
                                    <p className="text-sm">Try adjusting your filters or create a new task</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Edit/New Modal */}
            {editing && <EditCreateModal
                form={form}
                setForm={setForm}
                onClose={closeEditor}
                onSave={saveEdit}
                error={error}
                isNew={editing === "new"}
            />}
        </div>
    );
};

// Filter Section Component
const HeaderSection = ({ filters, applyFilters, openNew }) => {

    return (
        <div className="mb-4 p-4 rounded-b-lg shadow sticky top-0 z-10 bg-linear-to-br from-blue-300 to-blue-200">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <DatePicker
                    value={filters.dueDate ? dayjs(filters.dueDate) : null}
                    onChange={(date, dateString) => applyFilters(filters.status, dateString, filters.query)}
                    placeholder="Filter by due date"
                    allowClear
                    className="w-full sm:w-48"
                />

                <div className="flex flex-wrap gap-3 justify-end">
                    <div className="flex items-center bg-slate-50 rounded px-3 py-2 gap-2">
                        <FiSearch className="text-slate-400" />
                        <input
                            value={filters.query}
                            onChange={(e) => applyFilters(filters.status, filters.dueDate, e.target.value)}
                            placeholder="Search title or description..."
                            className="bg-transparent outline-none text-slate-700"
                        />
                        {filters.query && (
                            <button
                                className="ml-2 text-slate-400 hover:text-slate-700"
                                onClick={() => applyFilters(filters.status, filters.dueDate, "")}
                                aria-label="clear"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-150"
                    >
                        <FiPlus />
                        New Task
                    </button>
                </div>
            </div >
        </div >
    );
}

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

                    <div className="flex gap-3 items-center flex-wrap">
                        <div className="flex gap-2 items-center">
                            <label className="text-sm font-medium text-slate-700">Due date</label>
                            <DatePicker
                                value={form.dueDate ? dayjs(form.dueDate) : null}
                                onChange={(date, dateString) => {
                                    setForm({ ...form, dueDate: dateString });
                                }}
                                placeholder="Select due date"
                                allowClear
                                className=""
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
