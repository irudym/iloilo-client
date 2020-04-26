<template>
  <img alt="icon" :src="iconName" :style="iconStyle" @click="$emit('click')" />
</template>

<script>
import Spinner from '../assets/icons/spinner.svg';
import Envelope from '../assets/icons/envelope.svg';

export default {
  name: 'Icon',
  props: {
    name: String,
    width: {
      type: String,
      default: () => ('1.7rem'),
    },
  },
  data() {
    return {
      links: {
        spinner: Spinner,
        envelope: Envelope,
      },
    };
  },
  computed: {
    iconName() {
      return this.links[this.name];
    },
    iconStyle() {
      return {
        height: this.width,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.svg {
  height: 1.7rem;
}
</style>
