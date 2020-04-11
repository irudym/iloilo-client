<template>
  <div class="row">
    <div class="col">
      <div class="error-message">
        <p>
          <b>{{title}}</b>
        </p>
        <p>
          {{detail}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/bootstrap-grid.css';

export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    detail() {
      if (this.message) return this.message.detail;
      return null;
    },
    title() {
      if (this.message) return this.message.title;
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.error-message {
  border-left: 4px solid $warning-colour;
  width: 100%;
  // height: 4rem;
  padding: 1rem;
  margin-bottom: 3rem;
  background: $input_background-colour;
  text-align: left;
}

</style>
