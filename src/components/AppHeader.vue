<template>
  <div
    class="header d-flex flex-column flex-md-row align-items-center bg-white">
    <router-link :to="'/'" :style="{'margin-right': 'auto !important'}">
      <logo :width="'134px'"/>
    </router-link>
    <nav class="my-2 my-md-0 navigation">
      <div class="links">
        <router-link :to="'/quizzes'">
          Тесты
        </router-link>
      </div>
      <div class="links">
        <router-link :to="'/about'">
         О проекте
       </router-link>
      </div>
      <div class="links">
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
    margin: 0;
  }

  .my-p-2 {
    padding-right: 4.5rem;
  }
}

.links {
  display: inline;
  padding: 0 3rem;

  a {
    text-decoration: none;
    background: transparent;
    font-family: Roboto;
    font-weight: 500;
    font-size: 1rem;
    color: $title-colour;
  }
}

@media screen and (max-width: 510px) {
  .links {
    padding: 0 1rem;
  }
}

</style>
