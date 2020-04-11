<template>
  <div class="dialog">
    <h1>{{title}}</h1>
    <div class="content" :style="dialogStyle">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    width: {
      type: String,
      default: () => ('80%'),
    },
    title: {
      type: String,
      default: () => (''),
    },
  },
  computed: {
    dialogStyle() {
      return {
        width: this.width,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/layout.scss';

.dialog {
  position: relative;
  top: $dialog_shift;
  text-align: center;

  h1 {
    font-family: Roboto;
    font-size: 2.2rem;
    font-weight: 300;
    color: #ffffff;
  }

  .content {
    text-align: left;
    background: #ffffff;
    margin: 2rem auto;
    width: 80%;
    padding: 2rem 2rem;
    border-radius: 6px;
    box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.2);
    line-height: 1.6rem;
  }

  @media only screen and (max-width: 868px) {
    .content {
      width: 95%!important;
    }
  }
}

</style>
