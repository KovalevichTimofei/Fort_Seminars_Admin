<template>
  <q-page class="flex column">
    <Autocomplete
      :stringOptions="seminarsList"
      @autocomplete-filter="filterSeminarsList"
      @make-filter="filterListeners"
    />
    <Table
      :columns="columns"
      :data="listenersList"
      row_key="ifo"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Table from '../components/Table';
import Autocomplete from '../components/Autocomplete';

export default {
  name: 'Listeners',
  components: {
    Table,
    Autocomplete,
  },
  data() {
    return {
      columns: [
        {
          name: 'ifo',
          required: true,
          label: 'Имя',
          field: 'ifo',
          align: 'center',
          // sortable: true,
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          field: 'email',
          align: 'center',
          // sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      listenersList: state => state.listeners.listeners,
      loading: state => state.listeners.loading,
      seminarsList: state => state.seminars.seminars.map(seminar => ({
        label: seminar.title,
        value: seminar.id,
      })),
    }),
    // eslint-disable-next-line max-len
    listenersNamesList() {
      return this.listenersList.map(listener => listener.ifo);
    },
  },
  methods: {
    filterSeminarsList(val) {
      this.$store.dispatch('seminars/fetchAllSeminars', {
        filterBy: {
          field: 'title',
          value: val,
        },
      });
    },
    filterListeners(val) {
      this.$store.dispatch('listeners/fetchAllUsers', {
        filterBy: {
          field: 'seminar_id',
          value: val,
        },
      });
    },
  },
  beforeCreate() {
    this.$store.dispatch('listeners/fetchAllUsers');
    this.$store.dispatch('seminars/fetchAllSeminars');
  },
};
</script>

<style scoped>

</style>
