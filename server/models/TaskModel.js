import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        googlEventId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;