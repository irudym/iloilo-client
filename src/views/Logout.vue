<template>
  <div />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Logout',
  mounted() {
    clearInterval(this.countdownId);
    clearInterval(this.getTimeInterval);

    // logout user
    this.logoutUser();
    this.$router.push('/login');
  },
  methods: {
    ...mapActions(['logoutUser']),
  },
  computed: {
    ...mapGetters(['countdownId', 'getTimeInterval']),
  },
};
</script>
