<template>
  <div class="blue-background mx-auto">
    <div v-show="greeting" class="greeting">
      {{greeting}}
    </div>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BigBlueBar',
  computed: {
    ...mapGetters(['getUserName']),
    greeting() {
      if (this.getUserName) {
        return `Добрый день, ${this.getUserName}!`;
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';
@import '../styles/layout.scss';

.blue-background {
  background: $main-blue;
  height: $big-blue-bar_height;
}

.greeting {
  color: #ffffff;
  font-family: Roboto;
  font-size: 1rem;
  padding-left: 1rem;
  padding-top: 2rem;
}

</style>
