<template>
  <div class="button-container">
    <button
      class="start-button"
      type="submit"
      :style="buttonStyle"
      v-on:click.stop.prevent="$emit('click')"
    >
        {{title}}
    </button>
  </div>
</template>

<script>
export default {
  name: 'StartButton',
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
  margin: auto;
  width: 12rem;
}

.start-button {
  background: $start_button-colour;
  color: $start_button-text-colour;
  padding: 0.9rem 1.2rem;
  margin: 1rem 0;
  width: 100%;
  font-weight: 600;
}

.start-button:hover {
  background: $start_button-highlight;
}

.ok-button:active {
  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.5);
  font-size: 0.99rem;
}

</style>
