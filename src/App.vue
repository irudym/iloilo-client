<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import './assets/bootstrap-grid.css';

export default {
  name: 'App',
};
</script>

<style lang="scss">
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

button {
  font-family: Roboto;
  font-size: 1rem;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  border: none;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
