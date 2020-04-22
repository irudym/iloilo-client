/* eslint-disable import/prefer-default-export */
const translateMap = {
  'Unauthorized request': 'Ошибка доступа',
  'Invalid credentials': 'Неверно указаны почта или пароль',
  'Unprocessable Entity': 'Невозможно обработать запрос',
  'Validation failed: Active quiz must exist': 'Тест с таким PIN кодом недоступен',
  'Quiz is inactive': 'Тест завершился',
  'Sorry the quiz is finished, try the next time': 'Время теста истекло',
};

const translateString = (string) => (translateMap[string] || string);


export const localizeError = (error) => (
  {
    title: translateString(error.title),
    detail: translateString(error.detail),
  }
);
