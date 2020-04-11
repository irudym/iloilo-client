<template>
  <div>
    <app-header />
    <div>
      <ilo-dialog title="Тестирование" width="90%">
        <error-message v-show="errorMessage" v-bind:message="errorMessage" />
        <div v-if="!showSubmit">
          <h4>Вопрос {{currentQuestionIndex+1}}</h4>
          <div class="questions">
            {{currentQuestion}}
          </div>
          <div class="answers">
            <p v-for="answer in answers" :key="answer.text">
              <checkbox v-model="answer.correct">
              {{answer.text}}
              </checkbox>
            </p>
          </div>
          <start-button title="< Назад" @click="back"/>
          <start-button title="Вперед >" @click="forward"/>
        </div>
        <div v-else>
          <h4>
            Вы ответили на {{questionAnswered}} из {{questions.length}}
          </h4>
          <div class="questions">
            <p>
              Если Вы уверены в своих ответах, то нажмите конопку <b>Отправьте ответы</b>.
              Если у Вас есть сомнения, то можете еще раз просмотреть вопросы,
              нажав кнопку <b>Назад</b>.
            </p>
          </div>
          <start-button title="< Назад" @click="back"/>
          <start-button title="Отправить ответы" @click="submit" />
        </div>
      </ilo-dialog>
    </div>
   </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IloDialog from '../components/Dialog.vue';
import AppHeader from '../components/AppHeader.vue';
import Checkbox from '../components/Checkbox.vue';
import StartButton from '../components/StartButton.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import { serverUrl } from '../config/globals';
import { loadQuiz } from '../lib/api';
import { deSerializeQuiz } from '../lib/serializer';
import { createCountFormatter } from '../lib/utils';

export default {
  name: 'Evaluation',
  components: {
    AppHeader,
    Checkbox,
    StartButton,
    ErrorMessage,
    IloDialog,
  },
  props: {
    pin: String,
  },
  data() {
    return {
      errors: {},
      errorMessage: null,
      currentQuestionIndex: 0,
      questions: [{}],
      showSubmit: false,
    };
  },
  async mounted() {
    // load data from API server
    try {
      const response = await loadQuiz({ url: serverUrl, token: this.getToken, pin: this.pin });
      console.log('Evaluation[response]: ', response);
      console.log('Evaluation[deSerialized(response)', deSerializeQuiz(response));
      const deSerialized = deSerializeQuiz(response);
      this.questions = [...deSerialized.questions];
      this.quiz = { ...deSerialized.quiz };
    } catch (error) {
      this.errorMessage = error;
    }
  },
  methods: {
    back() {
      this.showSubmit = false;
      this.currentQuestionIndex -= 1;
      if (this.currentQuestionIndex < 0) {
        this.currentQuestionIndex = 0;
      }
    },
    forward() {
      this.currentQuestionIndex += 1;

      if (this.currentQuestionIndex >= this.questions.length) {
        this.currentQuestionIndex = this.questions.length;
        this.showSubmit = true;
      }
    },
    submit() {
    },
  },
  computed: {
    ...mapGetters(['getToken']),
    currentQuestion() {
      return this.questions[this.currentQuestionIndex].text;
    },
    answers() {
      return this.questions[this.currentQuestionIndex].answers;
    },
    questionAnswered() {
      const answered = this.questions.reduce((acc, question) => {
        if (question.answers.reduce((accul, answer) => accul || answer.correct, false)) {
          return acc + 1;
        }
        return acc;
      }, 0);
      return `${answered} ${createCountFormatter({
        one: 'вопрос',
        two: 'вопроса',
        few: 'вопросов',
      })(answered)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

h4 {
  color: $title-colour;
    font-family: Oswald;
    font-size: 1.1rem;
}

.questions {
  line-height: 1.8rem;
}

.answers {
  margin-top: 2rem;
}
</style>
