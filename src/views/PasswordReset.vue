<template>
  <div>
    <app-header />
    <big-blue-bar>
      <div class="dialog">
        <h1>Сброс пароля</h1>
        <form class="form">
          <error-message v-show="errorMessage" v-bind:message="errorMessage" @close="closeError" />
          <div v-show="showForm">
            <float-label label="Пароль" v-bind:error="errors.password" :value="password1">
              <input name="password" type="password" autocomplete="off" v-model="password1" />
            </float-label>
            <float-label label="Повторите пароль"
              v-bind:error="errors.password"
              :value="password2"
            >
              <input name="password" type="password" autocomplete="off" v-model="password2" />
            </float-label>
            <start-button title="Изменить" @click="submit" />
          </div>
          <div v-show="notice" class="form">
            Пароль был успешно изменен! Пожалуйста, авторизуйтесь в приложении,
            используя новые параметры входа.
            <start-button title="Дальше >" @click="toLogin" />
        </div>
        </form>
      </div>
    </big-blue-bar>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import BigBlueBar from '../components/BigBlueBar.vue';
import { updatePassword, checkPasswordReset } from '../lib/api';
import { serverUrl } from '../config/globals';
import { localizeError } from '../lib/localize';

const ErrorMessage = () => import('../components/ErrorMessage.vue');

export default {
  name: 'Login',
  components: {
    AppHeader,
    FloatLabel,
    StartButton,
    ErrorMessage,
    BigBlueBar,
  },
  props: {
    token: String,
  },
  data() {
    return {
      errors: {},
      password1: '',
      password2: '',
      errorMessage: null,
      notice: null,
    };
  },
  async mounted() {
    // check if token valid
    try {
      await checkPasswordReset({
        url: serverUrl,
        token: this.token,
      });
    } catch (error) {
      this.errorMessage = error;
    }
  },
  computed: {
    showForm() {
      return !this.errorMessage && !this.notice;
    },
  },
  methods: {
    closeError() {
      this.errorMessage = null;
    },
    toLogin() {
      this.$router.push('/login');
    },
    validate() {
      const errors = {};
      if (!this.password1.trim()) {
        errors.password = ['поле пароль не может быть пустым'];
      }
      if (this.password1 !== this.password2) {
        errors.password = ['введённые пароли не совпадают'];
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
          await updatePassword({
            url: serverUrl,
            token: this.token,
            password: this.password1,
          });
        } catch (error) {
          this.errorMessage = localizeError(error);
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
