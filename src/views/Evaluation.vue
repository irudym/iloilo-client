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
          <div v-if="submitted" class="notification">
            Вы уже ответили на этот вопрос
          </div>
          <div v-else-if="uploading" class="notification">
            Отправляем вопрос...
          </div>
          <div v-else class="notification placeholder">
            ...
          </div>
          <div class="questions">
            {{currentQuestion.text}}
          </div>
          <div class="answers">
            <p v-for="answer in answers" :key="answer.text">
              <checkbox
                :value="answer.correct"
                @input="changeAnswer(answer.id, $event)"
                :disabled="checkboxDisabled"
              >
              {{answer.text}}
              </checkbox>
            </p>
          </div>
          <div class="buttons">
            <loading-button v-if="uploading" />
            <start-button v-else title="Вперед >" @click="forward"/>
            <div v-if="currentQuestionIndex!=0" class="separator" />
            <start-button v-if="currentQuestionIndex!=0" title="< Назад" @click="back"/>
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
import OkButton from '../components/OkButton.vue';
import LoadingButton from '../components/LoadingButton.vue';
import RadialBar from '../components/RadialBar.vue';
import { serverUrl } from '../config/globals';
import { loadQuiz, evaluateQuestion, uploadVuexLogger } from '../lib/api';
import { deSerializeQuiz, serializeQuiz, deSerializeQuestion } from '../lib/serializer';
import { createCountFormatter } from '../lib/utils';
import { localizeError } from '../lib/localize';

const ErrorMessage = () => import('../components/ErrorMessage.vue');

export default {
  name: 'Evaluation',
  components: {
    AppHeader,
    Checkbox,
    StartButton,
    ErrorMessage,
    IloDialog,
    OkButton,
    LoadingButton,
    RadialBar,
  },
  props: {
    pin: String,
  },
  data() {
    return {
      errors: {},
      errorMessage: null,
      progress: 0,
    };
  },
  async mounted() {
    clearInterval(this.countdownId);
    clearInterval(this.getTimeInterval);

    // check if user logged in
    if (!this.isLogged) {
      this.$router.push('/login');
    }

    // load data from API server
    try {
      const response = await loadQuiz({ url: serverUrl, token: this.getToken, pin: this.pin });
      if (!response.data.attributes.started) {
        this.clearQuiz();
        this.$router.push('/');
      }

      let { quiz } = this;

      if (!this.getQuiz.pin || this.getQuiz.pin !== response.data.attributes.pin) {
        quiz = deSerializeQuiz(response);
        this.loadQuiz(quiz);
      }

      // check that the last question is not in uploading state
      // if this the case - re-submit it
      const lastIndex = this.quiz.questions.length - 1;
      if (this.quiz.questions[lastIndex].uploading) {
        this.moveToLastQuestionIndex();
        this.submitQuiz();
      }

      this.progress = this.duration;
      const currentTime = new Date();

      const endTime = new Date(quiz.ended_at);
      this.progress = Math.round((endTime - currentTime) / 60000);

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
      this.errorMessage = localizeError(error);
      if (error.detail === 'Not enough or too many segments') {
        this.$router.push('/login');
      }
    }
  },
  methods: {
    ...mapActions(['loadQuiz', 'clearQuiz', 'setAnswerValue', 'setCurrentQuestionIndex',
      'submitQuestion', 'unsubmitQuestion', 'addQuestion', 'setCountdownId',
      'increaseQuestionIndex', 'decreaseQuestionIndex', 'uploadQuestion', 'moveToLastQuestionIndex',
      'clearQuestionStates']),
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
      this.errorMessage = null;
      this.decreaseQuestionIndex();
      // this.sanityCheck();
    },
    validate() {
      const answers = this.answers.filter((answer) => (answer.correct));
      // console.log('Answers: ', answers);
      if (answers.length === 0) return false;
      return true;
    },
    async submitQuiz() {
      try {
        const quiz = serializeQuiz(this.getQuiz);

        const currentIndex = this.currentQuestionIndex;
        const response = await evaluateQuestion({
          url: serverUrl,
          pin: this.pin,
          token: this.getToken,
          quiz,
        });
        if (response.data.type === 'question') {
          // add question to the quiz
          const question = deSerializeQuestion(response);
          this.addQuestion(question);
          this.submitQuestion(this.quiz.questions[currentIndex]);

          // move to the last question
          this.moveToLastQuestionIndex();
        } else {
          // submit logger to API server
          await uploadVuexLogger({
            url: serverUrl,
            log: this.$vuexLogger,
            token: this.getToken,
          });
          this.clearQuiz();
          this.$router.push(`/result/${response.data.attributes.score}`);
        }
      } catch (error) {
        this.errorMessage = error;
        this.moveToLastQuestionIndex();
        this.clearQuestionStates(this.quiz.questions[this.currentQuestionIndex]);
      }
    },
    async forward() {
      this.errorMessage = null;
      if (!this.validate()) {
        this.errorMessage = { title: 'Ошибка', detail: 'Необходимо выбрать хотя бы один ответ' };
        return;
      }
      // check if currentQuestions is uploading, in case of uploading: do nothing
      if (this.quiz.questions[this.currentQuestionIndex].uploading) {
        return;
      }
      // check that there is no next question
      if (this.currentQuestionIndex + 1 >= this.quiz.questions.length) {
        // mark the current question as uploading
        this.uploadQuestion(this.quiz.questions[this.currentQuestionIndex]);

        // upload question with answer to API server
        this.submitQuiz();
      } else {
        // just switch to the next question
        this.increaseQuestionIndex();
      }
    },
    changeAnswer(id, value) {
      this.setAnswerValue({
        answerId: id,
        value,
      });
    },
  },
  computed: {
    ...mapGetters(['getToken', 'getQuiz', 'currentQuestionIndex', 'countdownId',
      'isLogged', 'getTimeInterval', 'currentQuestion']),
    ...mapState(['quiz', 'currentQuestionIndex']),
    /* currentQuestion() {
      if (this.quiz.questions[this.currentQuestionIndex]) {
        return this.quiz.questions.length > 0 ?
        this.quiz.questions[this.currentQuestionIndex].text : '';
      }
      return '';
    },
    */
    answers() {
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
    checkboxDisabled() {
      return this.submitted || this.uploading;
    },
    uploading() {
      if (this.quiz.questions[this.currentQuestionIndex]) {
        return this.quiz.questions[this.currentQuestionIndex].uploading;
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
      // console.log('Evaluation=> DURATION: ', this.quiz.duration);

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
  flex-direction: row-reverse;
  justify-content: space-between;
}

.notification {
  font-weight: 500;
  font-size: 0.9rem;
  color: $warning-colour;
}

.separator {
  width: 0.5rem;
}

.placeholder {
  color: white;
}
</style>
