<template>
  <div class="container">
    <div class="task">
      <!-- title -->
      <div class="title">
        <h1
          style="
            font-family: Arial, sans-serif;
            text-shadow: 2px 2px 5px #888888;
            color: chocolate;
          "
        >
          Kiruma's ToDo List Application
        </h1>
      </div>
      <!-- form -->
      <div class="form">
        <input
          type="text"
          placeholder="New Task"
          v-model="newTask"
          @keyup.enter="addTask"
        />
        <button @click="addTask"><i class="fas fa-plus"></i></button>
      </div>

      <div class="taskItems">
        <ul>
          <task-item
            v-bind:task="task"
            v-for="(task, index) in tasks"
            :key="task._id"
            @remove="removeTask(task._id, index)"
            @complete="toggleTaskCompletion(task)"
            @update="startEditTask(task)"
          ></task-item>

          <div v-if="editingTask" class="form">
            <input
              type="text"
              v-model="editingTaskText"
              @keyup.enter="updateTask"
            />
            <div style="margin-top: 10px">
              <button
                @click="cancelEditTask"
                style="
                  background-color: red;
                  color: white;
                  padding: 5px 10px;
                  margin-left: 10px;
                "
              >
                <i class="fas fa-times"></i>
              </button>

              <button
                @click="updateTask"
                style="
                  background-color: green;
                  color: white;
                  padding: 5px 10px;
                  margin-right: 10px;
                "
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </ul>
      </div>

      <!-- buttons -->
      <div class="clearBtns">
        <button @click="clearCompleted">Clear completed</button>
        <button @click="clearAll">Clear all</button>
      </div>

      <!-- pending task -->
      <div class="pendingTasks">
        <span>Pending Tasks: {{ incomplete }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TaskItem from "./Task-item";

export default {
  name: "Task",
  components: {
    TaskItem,
  },
  data() {
    return {
      newTask: "",
      tasks: [],
      editingTask: null,
      editingTaskText: "",
    };
  },
  computed: {
    incomplete() {
      return this.tasks.filter((task) => !task.completed).length;
      //console.log(this.task.incompleted);
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get("http://localhost:5000/");
        this.tasks = response.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    async addTask() {
      if (this.newTask) {
        try {
          const response = await axios.post("http://localhost:5000/save", {
            text: this.newTask,
          });
          this.tasks.push(response.data);
          this.newTask = "";
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }
    },
    async toggleTaskCompletion(task) {
      try {
        task.completed = !task.completed;
        await axios.put("http://localhost:5000/update", {
          _id: task._id,
          text: task.text,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    async removeTask(id, index) {
      try {
        await axios.delete("http://localhost:5000/delete", {
          data: { _id: id },
        });
        this.tasks.splice(index, 1);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    async clearCompleted() {
      const completedTasks = this.tasks.filter((task) => task.completed);
      for (let task of completedTasks) {
        await this.removeTask(task._id);
      }
    },
    async clearAll() {
      for (let task of this.tasks) {
        await this.removeTask(task._id);
      }
    },
    startEditTask(task) {
      this.editingTask = task;
      this.editingTaskText = task.text;
    },
    cancelEditTask() {
      this.editingTask = null;
      this.editingTaskText = "";
    },
    async updateTask() {
      if (this.editingTask && this.editingTaskText) {
        try {
          const response = await axios.put(
            "http://localhost:5000/update/{id}",
            {
              _id: this.editingTask._id,
              text: this.editingTaskText,
            }
          );
          const index = this.tasks.findIndex(
            (task) => task._id === this.editingTask._id
          );
          if (index !== -1) {
            this.$set(this.tasks, index, response.data);
          }
          this.editingTask = null;
          this.editingTaskText = "";
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    },
  },

  async created() {
    await this.fetchTasks();
  },
};
</script>

