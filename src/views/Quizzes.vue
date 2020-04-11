<template>
   <div>
    <app-header />
    <big-blue-bar>
      <ilo-dialog title="Начать тестирование" width="60%">
        <error-message v-show="errorMessage" v-bind:message="errorMessage" />
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
          <start-button title="Подключится >" @click="start" />
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
import ErrorMessage from '../components/ErrorMessage.vue';
import { serverUrl } from '../config/globals';
import { getQuizInfo } from '../lib/api';
import { sanitizeString } from '../lib/utils';


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
    ...mapActions(['setTimeInterval']),
    async start() {
      this.errorMessage = null;
      // get quiz information
      try {
        const response = await getQuizInfo({
          url: serverUrl,
          token: this.getToken,
          pin: sanitizeString(this.pin),
        });
        console.log('QUIZZES[response]: ', response);
        this.connected = true;
        this.info = response.data.attributes;
        if (this.info.started) {
          this.$router.push(`/evaluation/${this.pin}`);
        }
        const timeId = setInterval(this.checkQuiz, 3000);
        this.setTimeInterval(timeId);
      } catch (error) {
        this.errorMessage = error;
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
  },
  computed: {
    ...mapGetters(['getToken', 'getTimeInterval']),
  },
  mounted() {
    // this.connected = false;
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
