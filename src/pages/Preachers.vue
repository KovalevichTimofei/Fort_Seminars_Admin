<template>
  <q-page class="flex">
    <Table
      :columns="columns"
      :data="preachersList"
      row_key="ifo"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Table from '../components/Table';

export default {
  name: 'Preachers',
  components: {
    Table,
  },
  data() {
    return {
      columns: [
        {
          name: 'avatar',
          required: true,
          label: 'Имя',
          field: 'photo_url',
          align: 'center',
          sortable: true,
        },
        {
          name: 'ifo',
          required: true,
          label: 'Имя',
          field: 'ifo',
          align: 'center',
          sortable: true,
        },
        {
          name: 'preacher_info',
          required: true,
          label: 'Описание',
          field: 'info',
          align: 'center',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      preachersList: state => state.preachers.preachers,
      loading: state => state.preachers.loading,
    }),
  },
  beforeCreate() {
    this.$store.dispatch('preachers/fetchAllPreachers');
  },
};
</script>

<style scoped>

</style>
