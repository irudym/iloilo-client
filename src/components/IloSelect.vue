<template>
<div class="select-container">
  <input name="select" type="text" autocomplete="off" v-model="select" @click="showList" />
  <dropdown-button @click="showList" />
  <div class="option-list" :style="listStyle">
    <ul>
      <li v-for="option in filteredOptions" :key="option.id">
        {{option.text}}
      </li>
    </ul>
  </div>
</div>
</template>


<script>
import DropdownButton from './DropdownButton.vue';

export default {
  name: 'IloSelect',
  components: {
    DropdownButton,
  },
  props: {
    options: Array,
    value: {
      type: [String, Object],
      default() { return null; },
    },
  },
  data() {
    return {
      listVisible: false,
      select: '',
    };
  },
  methods: {
    showList() {
      console.log('SHOW LIST');
      this.listVisible = !this.listVisible;
    },
  },
  computed: {
    filteredOptions() {
      return this.options;
    },
    listStyle() {
      return {
        display: this.listVisible ? 'block' : 'none',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.select-container {
  input {
    height: 2.5rem!important;
    font-size: 1rem;
    // padding: 0rem 0.5rem 0 0.5rem;
    border: 1px solid $form_border-colour;
    display: block;
    border-radius: 3px;
    width: 100%;
    position: relative;
    background-color: $input_background-colour;
    outline: none;
  }
}

.option-list {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid gray;
  border-radius: 6px;
  user-select: none;
}

</style>
