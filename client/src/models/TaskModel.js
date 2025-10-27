export default class TaskModel {
    constructor(id, title, description, dueDate, completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = completed;
    }

    isValid() {
        return this.title && this.title.trim() !== "" && this.dueDate;
    }
}