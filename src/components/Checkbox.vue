<template>
  <label class="container">
    {{text}}
    <slot />
    <input type="checkbox" :checked="value" @input="update">
    <span class="checkmark"></span>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: Boolean,
    text: {
      type: String,
      default() {
        return null;
      },
    },
  },
  methods: {
    update(e) {
      this.$emit('input', e.target.checked);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: transparent;
  border: 1px solid $form_border-colour;
  border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #E7FFE1;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: transparent;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
  left: 2px;
  top: 2px;
  width: 12px;
  height: 12px;
  border: 1px solid $checkbox_checkborder-colour;
  background: $checkbox_check-colour;
  border-radius: 2px;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
}

</style>
