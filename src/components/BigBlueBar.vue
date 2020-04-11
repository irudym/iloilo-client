<template>
  <div class="blue-background mx-auto">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BigBlueBar',
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';
@import '../styles/layout.scss';

.blue-background {
  background: $main-blue;
  height: $big-blue-bar_height;
}

</style>
