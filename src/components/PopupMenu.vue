<template>
  <div class="popup-menu">
    <div class="menu-title" @click="click" tabindex="0" @focusout="close">
      {{title}}
    </div>
    <div class="menu-container" :style="menuStyle">
      <div class="menu-content">
          <router-link v-for="item in items" :key="item.id" v-bind:to="item.link">
              {{item.name}}
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupMenu',
  props: {
    title: String,
    items: Array,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    // trick to support phone devices without hover
    click() {
      this.showMenu = true;
    },
    close() {
      this.showMenu = false;
    },
  },
  computed: {
    menuStyle() {
      return this.showMenu ? { display: 'block' } : null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.popup-menu {
  position: relative;
  display: inline-block;
}

.menu-title {
  cursor: pointer;
  display: inline;
  color: white;
  border-bottom: 1px solid white;
  font-weight: 500;
  outline: transparent;
}

.menu-container {
  background: transparent;
  display: none;
  position: absolute;
  z-index: 1000;
  top: 1rem;
  user-select: none;
}

.menu-content {
  background: white;
  border-radius: 6px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
  margin-top: 1rem;
  padding: 0.5rem 0;
  a {
    color: $title-colour;
    padding: 0.8rem 1rem;
    text-decoration: none;
    display: block;
  }

  a:hover {
    background: $start_button-colour;
    color: $start_button-text-colour;
  }
}

// .popup-menu:hover .menu-container {
//  display: block;
// }

</style>
