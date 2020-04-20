<template>
  <div>
    <app-header />
    <big-blue-bar>
      <ilo-dialog title="Регистрация" width="60%">
        <error-message v-show="errorMessage" v-bind:message="errorMessage" />
        <div class="row">
          <div class="col-sm-6">
            <float-label label="Имя" v-bind:error="errors.firstName" :value="firstName">
              <input name="first name" type="text" autocomplete="off" v-model="firstName" />
            </float-label>
          </div>
          <div class="col-sm-6">
            <float-label label="Фамилия" v-bind:error="errors.lastName" :value="lastName">
              <input name="last name" type="text" autocomplete="off" v-model="lastName" />
            </float-label>
          </div>
        </div>
        <float-label label="E-mail" v-bind:error="errors.email" :value="email">
          <input name="email" type="text" autocomplete="off" v-model="email" />
        </float-label>
        <float-label label="Пароль" v-bind:error="errors.password" :value="password1">
          <input name="password" type="password" autocomplete="off" v-model="password1" />
        </float-label>
        <float-label label="Повторите пароль" v-bind:error="errors.password" :value="password2">
          <input name="password" type="password" autocomplete="off" v-model="password2" />
        </float-label>
        <p>
          Нажимая кнопку <b>Дальше</b> Вы соглашаетесь с тем, что ваши
          персональные данные будет сохранены и
          <router-link :to="'/license'" target="_blank">
            даёте согласие на обработку своих Персональных данных
          </router-link>
        </p>
        <start-button title="Дальше >" @click="submit" />
      </ilo-dialog>
    </big-blue-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import IloDialog from '../components/Dialog.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import AppHeader from '../components/AppHeader.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import { signup } from '../lib/api';
import { serverUrl } from '../config/globals';
import BigBlueBar from '../components/BigBlueBar.vue';
// import IloSelect from '../components/IloSelect.vue';

/*
        <float-label label="Группа (необязательно)" v-bind:error="errors.email" :value="email">
          <ilo-select :options="[{id: 0, text: 'Canada'}, {id: 1, text: 'United States'}]" />
        </float-label>
*/

export default {
  name: 'Registration',
  components: {
    IloDialog,
    FloatLabel,
    StartButton,
    AppHeader,
    ErrorMessage,
    BigBlueBar,
    // IloSelect,
  },
  data() {
    return {
      errors: {},
      email: '',
      firstName: '',
      lastName: '',
      password1: '',
      password2: '',
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    validate() {
      const errors = {};
      if (!this.firstName.trim()) {
        errors.firstName = ['поле имя не может быть пустым'];
      }
      if (!this.lastName.trim()) {
        errors.lastName = ['необходимо указать фамилию'];
      }
      if (!this.email.trim()) {
        errors.email = ['необходимо указать адрес электронной почты'];
      }
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
        console.log('Submit: ', this.email, '  pass: ', this.password1);
        try {
          const user = {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            password: this.password1,
          };
          const response = await signup({ url: serverUrl, user });
          // console.log('RESPONSE: ', response);
          // eslint-disable-next-line camelcase
          // const { email, auth_token, id } = response;
          this.loginUser(response);
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

</style>
