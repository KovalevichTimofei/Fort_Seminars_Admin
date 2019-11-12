<template>
  <q-page class="flex">
    <Table
      :columns="columns"
      :data="preachersList"
      row_key="id"
      :pagination.sync=pagination
      @delete-items="openConfirmDeleteModal"
    />
    <ConfirmDeleteModal
      text="Вы действительно хотите удалить выбранных проповедников?"
      @delete-confirmed="deletePreachers"
      v-model="isConfirmDeleteModalOpen"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Table from '../components/Table';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default {
  name: 'Preachers',
  components: {
    Table,
    ConfirmDeleteModal,
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
      pagination: { rowsPerPage: 20 },
      isConfirmDeleteModalOpen: false,
      selectedIds: [],
    };
  },
  computed: {
    ...mapState({
      preachersList: state => state.preachers.preachers,
      loading: state => state.preachers.loading,
    }),
  },
  methods: {
    openConfirmDeleteModal(selectedIds) {
      this.isConfirmDeleteModalOpen = true;
      this.selectedIds = selectedIds;
    },
    deletePreachers() {
      this.selectedIds.forEach(id => this.$store.dispatch('preachers/deletePreacher', id));
    },
  },
  beforeCreate() {
    this.$store.dispatch('preachers/fetchAllPreachers');
  },
};
</script>

<style scoped>

</style>
