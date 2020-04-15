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
        <div>
          <h4>Ваш результат:</h4>
          <div class="score">{{score}}%</div>
        </div>
      </ilo-dialog>
    </div>
   </div>
</template>

<script>
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
    font-size: 1.1rem;
}

.score {
  font-family: Oswald;
  font-size: 4rem;
  color: $title-colour;
  text-align: center;
  margin-bottom: 4rem;
}


</style>
