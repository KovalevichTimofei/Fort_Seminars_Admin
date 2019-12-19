<template>
  <q-card class="q-pa-md position">
    <q-card-section>
      <div class="text-h6 text-center">Авторизация</div>
    </q-card-section>
    <q-card-section>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          outlined
          v-model="login"
          label="Логин"
          lazy-rules
          :rules="[ val => !!val || 'Это поле обязательно для заполнения!']"
        />
        <q-input
          outlined
          type="password"
          v-model="password"
          label="Пароль"
          lazy-rules
          :rules="[val => !!val || 'Это поле обязательно для заполнения!']"
        />
        <div>
          <q-btn label="Войти" type="submit" color="primary"/>
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import notificationsOptions from '../mixins/notificationsOptions';

export default {
  name: 'SignIn',
  mixins: [notificationsOptions],
  data() {
    return {
      login: null,
      password: null,
    };
  },
  computed: {
    ...mapState('signIn', ['loading']),
  },
  methods: {
    ...mapActions('auth', ['signIn']),
    onSubmit() {
      const { login, password } = this;

      const dismiss = this.showNotif('pendingMessage', 'Проверка...');

      this.signIn({
        header: {
          alg: 'HS256',
        },
        payload: {
          login, password,
        },
      }).then(() => {
        this.showNotif('successMessage', 'Вы успешно авторизованы!');
        this.$router.push('/seminars');
      })
        .catch(() => {
          this.showNotif('failMessage', 'Не удаётся войти! Проверьте корректность введённых данных.');
        })
        .finally(() => dismiss());
    },
    onReset() {
      this.login = null;
      this.password = null;
    },
  },
};
</script>

<style scoped>
  .position {
    margin: 100px auto;
    max-width: 400px;
  }
</style>
