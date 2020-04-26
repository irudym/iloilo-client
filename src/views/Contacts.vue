<template>
    <div>
    <app-header />
    <big-blue-bar>
      <ilo-dialog title="Контакты">
        <ok-button
          title="<< Назад"
          :style="{'margin-bottom': '2rem'}"
          @click="exit"
        />
        <p>
          Все предложения, замечания и пожелания можно отправить по адресу:
        </p>
        <div class="email">
          <a href="mailto:iloilo.feedback@gmail.com">
            <icon name="envelope" :style="{'margin-right': '0.5rem'}" />
            <div
              :style="{'display': 'table-cell', 'vertical-align': 'middle'}"
            > iloilo.feedback </div>
          </a>
        </div>
      </ilo-dialog>
    </big-blue-bar>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import IloDialog from '../components/Dialog.vue';
import BigBlueBar from '../components/BigBlueBar.vue';
import OkButton from '../components/OkButton.vue';
import Icon from '../components/Icon.vue';

export default {
  name: 'Contacts',
  components: {
    AppHeader,
    IloDialog,
    BigBlueBar,
    OkButton,
    Icon,
  },
  methods: {
    exit() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colours.scss';

.email {
  display: table;
  a {
    color: $options_edit-color;
  }
}

</style>
