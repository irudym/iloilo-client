<template>
   <div>
    <app-header />
    <big-blue-bar>
      <ilo-dialog title="Начать тестирование" width="60%">
        <error-message v-show="errorMessage" v-bind:message="errorMessage" @close="closeError"/>
        <div v-if="connected" class="info">
          <h4>{{info.title}}</h4>
          <div v-if="!info.started" class="description">
            Ожидайте начала теста
          </div>
        </div>
        <div v-else>
          <float-label label="PIN" v-bind:error="errors.pin" :value="pin">
            <input name="PIN" type="text" autocomplete="off" v-model="pin" />
          </float-label>
          <start-button title="Подключиться >" @click="start" />
        </div>
      </ilo-dialog>
    </big-blue-bar>
   </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BigBlueBar from '../components/BigBlueBar.vue';
import IloDialog from '../components/Dialog.vue';
import AppHeader from '../components/AppHeader.vue';
import FloatLabel from '../components/FloatLabel.vue';
import StartButton from '../components/StartButton.vue';
import { serverUrl } from '../config/globals';
import { getQuizInfo } from '../lib/api';
import { sanitizeString } from '../lib/utils';

const ErrorMessage = () => import('../components/ErrorMessage.vue');

export default {
  name: 'Quizzes',
  data() {
    return {
      errors: {},
      pin: '',
      errorMessage: null,
      started: false,
      connected: false,
      info: {
        title: '',
        started: false,
      },
    };
  },
  components: {
    BigBlueBar,
    AppHeader,
    FloatLabel,
    StartButton,
    ErrorMessage,
    IloDialog,
  },
  methods: {
    ...mapActions(['setTimeInterval', 'clearQuiz']),
    async start() {
      this.errorMessage = null;
      if (this.pin.trim() === '') {
        const errors = {};
        errors.pin = ['Необходимо ввести PIN теста'];
        this.errors = errors;
        return;
      }
      const pin = sanitizeString(this.pin);
      this.pin = pin;
      // get quiz information
      try {
        const response = await getQuizInfo({
          url: serverUrl,
          token: this.getToken,
          pin,
        });
        // console.log('Quizzes.vue=> QUIZZES[response]: ', response);
        this.clearQuiz();

        if (response.data.type === 'evaluation') {
          this.$router.push(`/result/${response.data.attributes.score}`);
        }

        this.connected = true;
        this.info = response.data.attributes;

        this.clearQuiz();
        if (this.info.started) {
          this.$router.push(`/evaluation/${pin}`);
        }
        const timeId = setInterval(this.checkQuiz, 3000);
        this.setTimeInterval(timeId);
      } catch (error) {
        this.errorMessage = error;
        console.log('Quizzes.vue=> error', error);
        if (error.detail === 'Signature verification raised') {
          this.$router.push('/login');
        }
      }
      // this.go('/evaluations/pin');
      // store questions and answers in Vuex
    },
    async checkQuiz() {
      try {
        const response = await getQuizInfo({ url: serverUrl, token: this.getToken, pin: this.pin });
        if (response.data.attributes.started) {
          // stop interval
          clearInterval(this.getTimeInterval);
          this.$router.push(`/evaluation/${this.pin}`);
        }
      } catch (error) {
        this.errorMessage = error;
      }
    },
    closeError() {
      this.errorMessage = null;
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getTimeInterval', 'isLogged']),
  },
  mounted() {
    // this.connected = false;
    clearInterval(this.getTimeInterval);

    // check if user logged in
    if (!this.isLogged) {
      this.$router.push('/login');
    }
  },
  beforeDestroy() {
    clearInterval(this.getTimeInterval);
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.description {
  font-family: Roboto;
  font-weight: 500;
  color: $description-colour
}

.info {
  h4 {
    color: $title-colour;
    font-family: Oswald;
    font-size: 1.3rem;
  }
}

</style>
