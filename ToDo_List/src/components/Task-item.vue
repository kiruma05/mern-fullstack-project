<template>
  <li>
    <button @click="toggleComplete" :class="className">
      <i :class="task.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
      {{ task.text }}
    </button>
    <div>
      <button @click="$emit('remove')" class="delete-button">delete</button>
      |
      <button @click="$emit('update')" class="update-button">update</button>
    </div>
  </li>
</template>

<script>
export default {
  name: "TaskItem",
  props: ["task"],
  computed: {
    className() {
      return {
        toggle: true,
        "toggle-completed": this.task.completed,
      };
    },
  },
  methods: {
    toggleComplete() {
      this.$emit("complete", this.task); 
      console.log(this.task);
    },
  },
};
</script>

<style>
.delete-button {
  color: red;
}
.update-button {
  color: green;
}
</style>
