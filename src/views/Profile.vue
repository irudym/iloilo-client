<template>
  <div>
    <app-header />
    <big-blue-bar>
      <ilo-dialog title="Редактировать профиль" width="60%">
        <ok-button
          title="<< Назад"
          :style="{'margin-bottom': '2rem'}"
          @click="exit"
        />
        <error-message v-show="errorMessage" v-bind:message="errorMessage" />
        <info-message
          v-show="notificationMessage"
          :message="notificationMessage"
          @close="closeInfo"
        />
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
          <input
            name="email"
            type="text"
            autocomplete="off"
            v-model="email"
            disabled
            class="email-input"
          />
        </float-label>
        <float-label label="Пароль" v-bind:error="errors.password" :value="password1">
          <input name="password" type="password" autocomplete="off" v-model="password1" />
        </float-label>
        <float-label label="Повторите пароль" v-bind:error="errors.password" :value="password2">
          <input name="password" type="password" autocomplete="off" v-model="password2" />
        </float-label>
        <start-button title="Сохранить" @click="submit" />
      </ilo-dialog>
    </big-blue-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import IloDialog from '../components/Dialog.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import AppHeader from '../components/AppHeader.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import { getUserInfo, updateUser } from '../lib/api';
import { serverUrl } from '../config/globals';
import BigBlueBar from '../components/BigBlueBar.vue';
import InfoMessage from '../components/InfoMessage.vue';
import OkButton from '../components/OkButton.vue';
// import IloSelect from '../components/IloSelect.vue';

export default {
  name: 'Profile',
  components: {
    IloDialog,
    FloatLabel,
    StartButton,
    AppHeader,
    ErrorMessage,
    BigBlueBar,
    InfoMessage,
    OkButton,
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
      notificationMessage: null,
    };
  },
  async mounted() {
    clearInterval(this.countdownId);
    clearInterval(this.getTimeInterval);
    // console.log('Evaluation=> MOUNTED!');

    // check if user logged in
    if (!this.isLogged) {
      // console.log('Evaluation=> User should login! isLogged: ', this.isLogged);
      this.$router.push('/login');
    }

    try {
      const response = await getUserInfo({
        url: serverUrl,
        token: this.getToken,
        id: this.getUserId,
      });
      this.firstName = response.data.attributes.first_name;
      this.lastName = response.data.attributes.last_name;
      this.email = response.data.attributes.email;
    } catch (error) {
      this.errorMessage = error;
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    exit() {
      this.$router.go(-1);
    },
    closeInfo() {
      this.notificationMessage = null;
    },
    validate() {
      const errors = {};
      if (!this.firstName.trim()) {
        errors.firstName = ['поле имя не может быть пустым'];
      }
      if (!this.lastName.trim()) {
        errors.lastName = ['необходимо указать фамилию'];
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
      this.notificationMessage = null;
      if (!this.validate()) {
        this.errors = {};
        console.log('Submit: ', this.email, '  pass: ', this.password1);
        try {
          const user = {
            data: {
              type: 'user',
              id: this.getUserId,
              attributes: {
                first_name: this.firstName,
                last_name: this.lastName,
                password: this.password1.trim() ? this.password1 : null,
              },
            },
          };
          const response = await updateUser({
            url: serverUrl,
            token: this.getToken,
            id: this.getUserId,
            user,
          });

          console.log('[Profile]=> response: ', response);

          if (response.auth_token) {
            this.loginUser(response);
          }

          this.notificationMessage = {
            title: 'Успешно!',
            detail: 'Профиль пользователя обновлен',
          };

          // console.log('RESPONSE: ', response);
          // eslint-disable-next-line camelcase
          // const { email, auth_token, id } = response;
          // this.loginUser(response);
          // this.$router.push('/quizzes');
        } catch (error) {
          this.errorMessage = error;
        }
      }
    },
  },
  computed: {
    ...mapGetters(['getToken', 'countdownId', 'isLogged', 'getTimeInterval', 'getUserId']),
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.email-input {
  background: $options_edit-color!important;
  color: white;
}
</style>
