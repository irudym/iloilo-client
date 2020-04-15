<template>
  <div>
    <app-header />
    <div>
      <ilo-dialog title="Тестирование" width="70%">
        <ok-button
          title="<< Вернуться к выбору теста"
          :style="{'margin-bottom': '2rem'}"
          @click="exit"
        />
        <error-message v-show="errorMessage" v-bind:message="errorMessage" />
        <div v-if="!showSubmit">
          <h4>Вопрос {{currentQuestionIndex+1}}</h4>
          <div class="notification" v-if="submitted">
            Вы уже ответили на этот вопрос
          </div>
          <div class="questions">
            {{currentQuestion}}
          </div>
          <div class="answers">
            <p v-for="answer in answers" :key="answer.text">
              <checkbox :value="answer.correct" @input="changeAnswer(answer.id, $event)">
              {{answer.text}}
              </checkbox>
            </p>
          </div>
          <div class="buttons">
            <start-button v-if="currentQuestionIndex!=0" title="< Назад" @click="back"/>
            <start-button title="Вперед >" @click="forward"/>
          </div>
        </div>
        <div v-else>
          <h4>
            Вы ответили на {{questionAnswered}} из {{quiz.questions.length}}
          </h4>
          <div class="questions">
            <p>
              Если Вы уверены в своих ответах, то нажмите конопку <b>Отправьте ответы</b>.
              Если у Вас есть сомнения, то можете еще раз просмотреть вопросы,
              нажав кнопку <b>Назад</b>.
            </p>
          </div>
          <div class="buttons">
            <start-button title="< Назад" @click="back"/>
            <start-button title="Отправить ответы" @click="submit" />
          </div>
        </div>
      </ilo-dialog>
    </div>
   </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import IloDialog from '../components/Dialog.vue';
import AppHeader from '../components/AppHeader.vue';
import Checkbox from '../components/Checkbox.vue';
import StartButton from '../components/StartButton.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import OkButton from '../components/OkButton.vue';
import { serverUrl } from '../config/globals';
import { loadQuiz, evaluateQuestion } from '../lib/api';
import { deSerializeQuiz, serializeQuiz, deSerializeQuestion } from '../lib/serializer';
import { createCountFormatter } from '../lib/utils';

export default {
  name: 'Evaluation',
  components: {
    AppHeader,
    Checkbox,
    StartButton,
    ErrorMessage,
    IloDialog,
    OkButton,
  },
  props: {
    pin: String,
  },
  data() {
    return {
      errors: {},
      errorMessage: null,
      // showSubmit: false,
    };
  },
  async mounted() {
    // load data from API server
    try {
      const response = await loadQuiz({ url: serverUrl, token: this.getToken, pin: this.pin });
      if (!response.data.attributes.started) {
        this.clearQuiz();
        this.$router.push('/');
      }
      if (!this.getQuiz.pin || this.getQuiz.pin !== response.data.attributes.pin) {
        const quiz = deSerializeQuiz(response);
        this.loadQuiz(quiz);
      }
    } catch (error) {
      this.errorMessage = error;
      if (error.detail === 'Not enough or too many segments') {
        this.$router.push('/login');
      }
    }
  },
  methods: {
    ...mapActions(['loadQuiz', 'clearQuiz', 'setAnswerValue', 'setCurrentQuestionIndex',
      'submitQuestion', 'addQuestion']),
    exit() {
      this.$router.push('/quizzes');
    },
    back() {
      let index = this.currentQuestionIndex;
      index -= 1;
      if (index < 0) {
        index = 0;
      }
      this.setCurrentQuestionIndex(index);
    },
    async forward() {
      try {
        if (!this.quiz.questions[this.currentQuestionIndex].submitted) {
          const quiz = serializeQuiz(this.getQuiz);
          const response = await evaluateQuestion({
            url: serverUrl,
            pin: this.pin,
            token: this.getToken,
            quiz,
          });
          console.log('RESPONSE: ', response);
          if (response.data.type === 'question') {
            // add question to the quiz
            const question = deSerializeQuestion(response);
            console.log('QUESTION: ', question);
            this.addQuestion(question);
            this.submitQuestion(this.quiz.questions[this.currentQuestionIndex]);
          } else {
            this.clearQuiz();
            this.$router.push(`/result/${response.data.attributes.score}`);
          }
        }
        // move to next question
        const index = this.currentQuestionIndex;
        this.setCurrentQuestionIndex(index + 1);
      } catch (error) {
        this.errorMessage = error;
      }

      /*
      let index = this.currentQuestionIndex;
      index += 1;
      if (index >= this.quiz.questions.length) {
        index = this.quiz.questions.length;
      }
      this.setCurrentQuestionIndex(index);
      */
    },
    async submit() {
      // this.clearQuiz();
      /*
      const quiz = serializeQuiz(this.getQuiz);
      console.log('[Evaluation]: submit quiz= ', quiz);
      try {
        const response = await evaluateQuiz({
          url: serverUrl,
          token: this.getToken,
          pin: this.pin,
          quiz,
        });
        // console.log('RESPONSE: ', response);
        this.$router.push(`/result/${response.data.attributes.score}`);
      } catch (error) {
        this.errorMessage = error;
      }
      */
    },
    changeAnswer(id, event) {
      this.setAnswerValue({
        answerId: id,
        value: event,
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getQuiz', 'currentQuestionIndex']),
    ...mapState(['quiz', 'currentQuestionIndex']),
    showSubmit() {
      return (this.currentQuestionIndex >= this.quiz.questions.length);
    },
    currentQuestion() {
      if (this.quiz.questions[this.currentQuestionIndex]) {
        return this.quiz.questions.length > 0 ? this.quiz.questions[this.currentQuestionIndex].text : '';
      }
      return '';
    },
    answers() {
      // eslint-disable-next-line max-len
      if (this.quiz.questions[this.currentQuestionIndex]) {
        return this.quiz.questions.length > 0
          ? this.quiz.questions[this.currentQuestionIndex].answers
          : [];
      }
      return [];
    },
    submitted() {
      if (this.quiz.questions[this.currentQuestionIndex]) {
        return this.quiz.questions[this.currentQuestionIndex].submitted;
      }
      return false;
    },
    questionAnswered() {
      const answered = this.quiz.questions.reduce((acc, question) => {
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

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.notification {
  font-weight: 500;
  font-size: 0.9rem;
  color: $warning-colour;
}
</style>
