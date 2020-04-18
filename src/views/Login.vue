<template>
  <div>
    <app-header />
    <big-blue-bar>
      <div class="dialog">
        <h1>Вход</h1>
        <div class="first">
          В первый раз? Тогда
          <router-link to="/registration">
            зарегистрируйтесь!
          </router-link>
        </div>
        <div class="form">
          <error-message v-show="errorMessage" v-bind:message="errorMessage" />
          <float-label label="E-mail" v-bind:error="errors.email" :value="email">
            <input name="email" type="text" autocomplete="off" v-model="email" />
          </float-label>
          <float-label label="Пароль" v-bind:error="errors.password" :value="password">
            <input name="password" type="password" autocomplete="off" v-model="password" />
          </float-label>
          <start-button title="Дальше >" @click="submit"/>
        </div>
      </div>
    </big-blue-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AppHeader from '../components/AppHeader.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import { login } from '../lib/api';
import { serverUrl } from '../config/globals';
import BigBlueBar from '../components/BigBlueBar.vue';

export default {
  name: 'Login',
  components: {
    AppHeader,
    FloatLabel,
    StartButton,
    ErrorMessage,
    BigBlueBar,
  },
  data() {
    return {
      errors: {},
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    validate() {
      const errors = {};
      if (!this.email.trim()) {
        errors.email = ['необходимо указать адрес электронной почты'];
      }
      if (!this.password.trim()) {
        errors.password = ['поле пароля не может быть пустым'];
      }
      if (Object.keys(errors).length !== 0) {
        // show errors
        this.errors = errors;
        return errors;
      }
      return null;
    },
    async submit() {
      if (!this.validate()) {
        this.errors = {};
        try {
          const credentials = {
            email: this.email,
            password: this.password,
          };
          const response = await login({ url: serverUrl, credentials });
          const {
            email,
            // eslint-disable-next-line camelcase
            auth_token,
            id,
            // eslint-disable-next-line camelcase
            user_name,
          } = response;
          console.log('LOGIN: ', response);
          this.loginUser({
            email,
            auth_token,
            id,
            user_name,
          });
          this.$router.push('/quizzes');
        } catch (error) {
          this.errorMessage = error;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';
@import '../styles/layout.scss';

.first {
  color: #ffffff;
  font-size: 1.1rem;

  a {
    color: #ffffff;
  }
}

.dialog {
  position: relative;
  top: $dialog_shift;
  text-align: center;

  h1 {
    font-family: Roboto;
    font-size: 2.2rem;
    font-weight: 300;
    color: #ffffff;
  }

  .form {
    background: #ffffff;
    margin: 2rem auto;
    width: 30rem;
    padding: 2rem 1rem;
    border-radius: 6px;
    box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.2);;
  }

  @media only screen and (max-width: 768px) {
    .form {
      width: 95%!important;
    }
  }
}

</style>
