<template>
  <q-page class="flex">
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

export default {
  name: 'Listeners',
  components: {
    Table,
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
          sortable: true,
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          field: 'email',
          align: 'center',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      listenersList: state => state.listeners.listeners,
      loading: state => state.listeners.loading,
    }),
  },
  beforeCreate() {
    this.$store.dispatch('listeners/fetchAllUsers');
  },
};
</script>

<style scoped>

</style>
