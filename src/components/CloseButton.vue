<template>
  <div class="close-button" @click="$emit('click')">
    <div class="cross">&#x2715;</div>
  </div>
</template>

<script>
export default {
  name: 'CloseButton',
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';
.close-button {
  position: absolute;
  top: 0.5rem;
  right: 1.5rem;
  color: $trash_button-colour;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 2px solid $trash_button-colour;
  width: 1.2rem;
  height: 1.2rem;
  text-align: center;

  .cross {
    padding: 0;
    margin: auto;
    line-height: 1rem;
  }
}

.close-button:hover {
  .cross {
    color: #ffffff;
  }
  background: $trash_button-colour;
}
</style>
