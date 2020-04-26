<template>
  <div class="button-container">
    <button
      class="loading-button"
      disabled
      :style="buttonStyle"
    >
      <icon name="spinner" />
      Загрузка
    </button>
  </div>
</template>

<script>
import Icon from './Icon.vue';

export default {
  name: 'StartButton',
  components: {
    Icon,
  },
  props: {
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
  // margin: auto;
  width: 12rem;
}

.loading-button {
  background: white;
  color: $start_button-colour;
  padding: 0.9rem 1.2rem;
  margin: 1rem 0;
  width: 100%;
  font-weight: 600;
  border: 1px solid $form_border-colour;
}

.loading-button:hover {
  background: white;
}

</style>
