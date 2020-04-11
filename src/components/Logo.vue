<template>
  <img alt="logo" class="mr-md-auto logo" :src="logo" :style="logoStyle" @click="$emit('click')" />
</template>

<script>
import LogoPNG from '../assets/logo.png';

export default {
  name: 'Logo',
  props: {
    width: {
      type: String,
      default: () => (null),
    },
  },
  data() {
    return {
      logo: LogoPNG,
    };
  },
  computed: {
    logoStyle() {
      return {
        width: this.width,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  margin: 0 0.5rem;
}
</style>
