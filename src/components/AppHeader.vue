<template>
  <div
    class="header d-flex flex-column flex-md-row align-items-center bg-white">
    <logo :width="'134px'"/>
    <nav class="my-2 my-md-0 mr-md-3 navigation">
      <div class="p-2 text-dark links">
        <router-link :to="'/about'">
         О проекте
       </router-link>
      </div>
      <div class="p-2 text-dark links">
        <router-link :to="'/contacts'">
          Контакты
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
import Logo from './Logo.vue';

export default {
  name: 'AppHeader',
  components: {
    Logo,
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.header {
  padding: 0.5rem 0;
  a {
      text-decoration: none;
      background: transparent;
      font-family: Roboto;
      font-weight: 500;
      font-size: 1.2rem;
      color: $main-links-colour
    }

  .navigation {
    margin-right: 3rem!important;
  }

  .links {
    display: inline;
  }

  .my-p-2 {
    padding-right: 4.5rem;
  }
}
</style>
