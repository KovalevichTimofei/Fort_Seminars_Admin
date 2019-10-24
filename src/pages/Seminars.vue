<template>
  <q-page class="flex">
    <Table
      :columns="columns"
      :data="seminarsList"
      row_key="title"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Table from '../components/Table';

export default {
  name: 'Seminars',
  components: {
    Table,
  },
  data() {
    return {
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Название',
          field: 'title',
          align: 'center',
          sortable: true,
        },
        {
          name: 'invite_link',
          required: true,
          label: 'Ссылка на видеоприглашение в YouTube',
          field: 'invite_link',
          align: 'center',
          sortable: false,
        },
        {
          name: 'lessons',
          required: true,
          label: 'Уроки',
          field: 'lessons',
          align: 'center',
          sortable: false,
        },
        {
          name: 'preacher',
          required: true,
          label: 'Проповедник',
          field: 'preacher',
          align: 'center',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      seminarsList: state => state.seminars.seminars,
      loading: state => state.seminars.loading,
    }),
  },
  beforeCreate() {
    this.$store.dispatch('seminars/fetchAllSeminars');
  },
};
</script>
