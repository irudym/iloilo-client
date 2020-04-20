<template>
  <div class="blue-background mx-auto">
    <div v-show="greeting" class="greeting">
      {{greeting}}
      <popup-menu :title="getUserName" :items='menuItems' />
    </div>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PopupMenu from './PopupMenu.vue';

export default {
  name: 'BigBlueBar',
  components: {
    PopupMenu,
  },
  data() {
    return {
      menuItems: [
        {
          id: 100,
          name: 'Редактировать',
          link: '/user/profile',
        },
        {
          id: 200,
          name: 'Выйти',
          link: '/logout',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getUserName']),
    greeting() {
      if (this.getUserName !== undefined && this.getUserName !== null) {
        return 'Добрый день, ';
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
