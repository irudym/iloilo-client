<template>
  <div class="button-container">
    <button
      class="loading-button"
      disabled
      :style="buttonStyle"
    >
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'LoadingButton',
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
  background: $start_button-colour;
  color: $start_button-colour;
  padding: 0;
  margin: 1rem 0;
  width: 100%;
  font-weight: 600;
  // border: 1px solid $form_border-colour;
}

.loading-button:hover {
  background: $start_button-highlight;
}

.spinner {
  margin: 0 auto;
  width: 10rem;
  height: 2.2rem;
  text-align: center;
  font-size: 1rem;
}

.spinner > div {
  background-color: white;
  height: 100%;
  width: 1rem;
  margin-right: 0.3rem;
  display: inline-block;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  animation-delay: -1.1s;
}

.spinner .rect3 {
  animation-delay: -1.0s;
}

.spinner .rect4 {
  animation-delay: -0.9s;
}

.spinner .rect5 {
  animation-delay: -0.8s;
}


@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }  20% {
    transform: scaleY(1.0);
    opacity: 1;
  }
}

</style>
