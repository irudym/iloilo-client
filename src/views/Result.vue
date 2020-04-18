<template>
  <div>
    <app-header />
    <div>
      <big-blue-bar>
        <ilo-dialog title="Результат тестирования" width="70%">
          <ok-button
            title="<< Вернуться к выбору теста"
            :style="{'margin-bottom': '2rem'}"
            @click="exit"
          />
          <error-message v-show="errorMessage" v-bind:message="errorMessage" />
          <div class="info">
            <h4>Ваш результат:</h4>
            <div class="score">{{score}}</div>
          </div>
        </ilo-dialog>
      </big-blue-bar>
    </div>
   </div>
</template>

<script>
import BigBlueBar from '../components/BigBlueBar.vue';
import IloDialog from '../components/Dialog.vue';
import AppHeader from '../components/AppHeader.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import OkButton from '../components/OkButton.vue';

export default {
  name: 'Evaluation',
  components: {
    AppHeader,
    ErrorMessage,
    IloDialog,
    OkButton,
    BigBlueBar,
  },
  props: {
    score: String,
  },
  data() {
    return {
      errors: {},
      errorMessage: null,
      // showSubmit: false,
    };
  },
  methods: {
    exit() {
      this.$router.push('/quizzes');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

h4 {
  color: $title-colour;
  font-family: Oswald;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: 400;
}

.score {
  font-family: Oswald;
  font-size: 4rem;
  color: $add_button-border-colour;
  text-align: center;
  margin-bottom: 4.2rem;
}

.info {
  text-align: center;
}


</style>
