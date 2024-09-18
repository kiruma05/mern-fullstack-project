const ToDoModel = require('../Models/ToDomodels');

module.exports.getToDo = async (req, res) => {
    try {
        const todos = await ToDoModel.find();
        res.send(todos);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.saveToDo = async (req, res) => {
    const { text } = req.body;

    try {
        const todo = await ToDoModel.create({ text });
        res.send({ message: "Data added successfully", todo });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.updateToDo = async (req, res) => {
    const { _id, text, completed } = req.body;

    try {
        await ToDoModel.findByIdAndUpdate(_id, { text, completed });
        res.send({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.deleteToDo = async (req, res) => {
    const { _id } = req.body;

    try {
        await ToDoModel.findByIdAndDelete(_id);
        res.send({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
