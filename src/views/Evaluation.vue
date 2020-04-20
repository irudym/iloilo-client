<template>
  <div>
    <app-header />
    <div>
      <div>
        <radial-bar
          :radius="80"
          :progress="progress"
          :value="progress"
          :style="{margin: 'auto'}"
          :maximum="duration"
        />
      </div>
      <ilo-dialog title="Тестирование" width="70%" :style="{'top': '-9rem'}">
        <ok-button
          title="<< Вернуться к выбору теста"
          :style="{'margin-bottom': '2rem'}"
          @click="exit"
        />
        <error-message
          v-show="errorMessage"
          v-bind:message="errorMessage"
          @close="closeError"
        />
        <div>
          <h4>Вопрос {{currentQuestionIndex+1}}</h4>
          <div class="notification" v-if="submitted">
            Вы уже ответили на этот вопрос
          </div>
          <div class="questions">
            {{currentQuestion}}
          </div>
          <div class="answers">
            <p v-for="answer in answers" :key="answer.text">
              <checkbox
                :value="answer.correct"
                @input="changeAnswer(answer.id, $event)"
                :disabled="submitted"
              >
              {{answer.text}}
              </checkbox>
            </p>
          </div>
          <div class="buttons">
            <start-button v-if="currentQuestionIndex!=0" title="< Назад" @click="back"/>
            <start-button title="Вперед >" @click="forward"/>
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
import RadialBar from '../components/RadialBar.vue';
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
    RadialBar,
  },
  props: {
    pin: String,
  },
  data() {
    return {
      errors: {},
      errorMessage: null,
      // showSubmit: false,
      progress: 0,
    };
  },
  async mounted() {
    clearInterval(this.countdownId);
    // console.log('Evaluation=> MOUNTED!');

    // check if user logged in
    if (!this.isLogged) {
      // console.log('Evaluation=> User should login! isLogged: ', this.isLogged);
      this.$router.push('/login');
    }

    // load data from API server
    try {
      const response = await loadQuiz({ url: serverUrl, token: this.getToken, pin: this.pin });
      if (!response.data.attributes.started) {
        this.clearQuiz();
        this.$router.push('/');
      }
      // console.log('Evaluation=> check if quiz should be loaded!');

      let { quiz } = this;

      if (!this.getQuiz.pin || this.getQuiz.pin !== response.data.attributes.pin) {
        quiz = deSerializeQuiz(response);
        this.loadQuiz(quiz);
        // console.log('Evaluation=> deSerialized: ', quiz);
        // console.log('Evaluation=> check quiz from state: ', this.quiz);
      }
      // console.log('Evaluation=> Check if quiz was loaded, quiz from state: ', this.quiz);

      this.progress = this.duration;
      const currentTime = new Date();
      // console.log('Evaluation=> quiz: ', quiz);
      const endTime = new Date(quiz.ended_at);
      this.progress = Math.round((endTime - currentTime) / 60000);
      // console.log('Evaluation=> Ended_at: ', quiz.ended_at);
      // console.log('Evaluation=> Current time: ', currentTime);
      // console.log('Evaluation=> endTime: ', endTime);

      if (this.progress < 0) {
        this.progress = 0;
        this.errorMessage = {
          title: 'Ошибка',
          detail: 'Тест уже завершился, пожалуйста, проверте PIN код теста',
        };
        return;
      }
      const timeId = setInterval(this.updateTime, 60000);
      this.setCountdownId(timeId);
    } catch (error) {
      this.errorMessage = error;
      if (error.detail === 'Not enough or too many segments') {
        this.$router.push('/login');
      }
    }
  },
  methods: {
    ...mapActions(['loadQuiz', 'clearQuiz', 'setAnswerValue', 'setCurrentQuestionIndex',
      'submitQuestion', 'addQuestion', 'setCountdownId']),
    updateTime() {
      this.progress -= 1;
      if (this.progress < 0) this.progress = this.duration;
    },
    exit() {
      this.$router.push('/quizzes');
    },
    closeError() {
      this.errorMessage = null;
    },
    back() {
      let index = this.currentQuestionIndex;
      index -= 1;
      if (index < 0) {
        index = 0;
      }
      this.setCurrentQuestionIndex(index);
    },
    validate() {
      const answers = this.answers.filter((answer) => (answer.correct));
      // console.log('Answers: ', answers);
      if (answers.length === 0) return false;
      return true;
    },
    async forward() {
      this.errorMessage = null;
      if (!this.validate()) {
        this.errorMessage = { title: 'Ошибка', detail: 'Необходимо выбрать хотя бы один ответ' };
        return;
      }
      try {
        if (!this.quiz.questions[this.currentQuestionIndex].submitted) {
          const quiz = serializeQuiz(this.getQuiz);
          const response = await evaluateQuestion({
            url: serverUrl,
            pin: this.pin,
            token: this.getToken,
            quiz,
          });
          // console.log('Evaluation=> RESPONSE: ', response);
          if (response.data.type === 'question') {
            // add question to the quiz
            const question = deSerializeQuestion(response);
            // console.log('Evaluation=> QUESTION: ', question);
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
    },
    changeAnswer(id, value) {
      console.log('[Evaluation]=>answer[', id, '] event: ', value);

      this.setAnswerValue({
        answerId: id,
        value,
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getQuiz', 'currentQuestionIndex', 'countdownId', 'isLogged']),
    ...mapState(['quiz', 'currentQuestionIndex']),
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
    duration() {
      console.log('Evaluation=> DURATION: ', this.quiz.duration);

      if (this.quiz) {
        return this.quiz.duration;
      }
      return 0;
    },
  },
  beforeDestroy() {
    clearInterval(this.countdownId);
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
