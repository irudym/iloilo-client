<template>
  <div>
    <app-header />
    <big-blue-bar>
      <div class="dialog">
        <h1>Сброс пароля</h1>
        <error-message v-show="errorMessage" v-bind:message="errorMessage" @close="closeError" />
        <form v-show="showForm" class="form">
          <float-label label="E-mail" v-bind:error="errors.email" :value="email">
            <input name="email" type="text" autocomplete="off" v-model="email" />
          </float-label>
          <start-button title="Изменить" @click="submit" />
        </form>
        <div v-show="notice" class="form">
          Запрос на изменение отправлен. На ваш электронный почтовый ящик
          должно прийти письмо с ссылкой на сброс пароля.
        </div>
      </div>
    </big-blue-bar>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import BigBlueBar from '../components/BigBlueBar.vue';
import { passwordReset } from '../lib/api';
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
  data() {
    return {
      errors: {},
      email: '',
      errorMessage: null,
      notice: null,
    };
  },
  computed: {
    showForm() {
      return !this.notice;
    },
  },
  methods: {
    closeError() {
      this.errorMessage = null;
    },
    validate() {
      const errors = {};
      if (!this.email.trim()) {
        errors.email = ['необходимо указать адрес электронной почты'];
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
          await passwordReset({
            url: serverUrl,
            email: this.email,
          });
          this.notice = true;
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
