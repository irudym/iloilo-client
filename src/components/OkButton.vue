<template>
  <div class="button-container">
    <button
      class="ok-button"
      :style="buttonStyle"
      v-on:click.stop.prevent="$emit('click')"
    >
        {{title}}
    </button>
  </div>
</template>

<script>
export default {
  name: 'OkButton',
  props: {
    title: String,
    buttonStyle: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/layout.scss';
@import '../styles/colours.scss';

.button-container {
  height: 5rem;
  display: inline-flex;
}

.ok-button {
  background: $ok_button-colour;
  color: $ok_button-text-colour;
  padding: 0.9rem 1.2rem;
  margin: 1rem 0;
}

.ok-button:hover {
  background: $ok_button-highlight;
}

</style>
