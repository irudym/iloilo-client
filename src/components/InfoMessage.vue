<template>
  <div v-show="visible" class="row">
    <div class="col">
      <div class="info-message">
        <close-button @click="close"/>
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
import CloseButton from './CloseButton.vue';

export default {
  name: 'InfoMessage',
  components: {
    CloseButton,
  },
  props: {
    message: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    close() {
      // this.visible = false;
      this.$emit('close');
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

.info-message {
  border-left: 6px solid $add_button-colour;
  width: 100%;
  // height: 4rem;
  padding: 1rem;
  margin-bottom: 3rem;
  background: $info_box-colour;
  text-align: left;
  border-radius: 6px;
}

</style>
