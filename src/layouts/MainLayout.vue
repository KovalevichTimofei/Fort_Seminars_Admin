<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Администратор Semafort
        </q-toolbar-title>

        <div @click="logOut">
          Выйти
          <q-icon name="exit_to_app" size="sm" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Разделы</q-item-label>
        <q-item clickable router-link to="/seminars">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Семинары</q-item-label>
            <q-item-label caption>Прошедшие, текущие и будущие</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable router-link to="/listeners">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Аудитория</q-item-label>
            <q-item-label caption>Зарегистрированные люди</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" router-link to="/preachers">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Проповедники</q-item-label>
            <q-item-label caption>Информация о братьях</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" router-link to="/lessons">
          <q-item-section avatar>
            <q-icon name="library_books" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Уроки</q-item-label>
            <q-item-label caption>Полная информация по урокам</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MainLayout',

  data() {
    return {
      leftDrawerOpen: false,
    };
  },
  computed: {
    ...mapState('auth', ['signed']),
  },
  methods: {
    ...mapActions('auth', ['signOut']),
    logOut() {
      this.signOut();
      this.$forceUpdate();
    },
  },
  beforeUpdate() {
    if (!this.signed) {
      this.$router.push('/signin');
    }
  },
};
</script>
