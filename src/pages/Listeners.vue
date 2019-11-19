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
      row_key="id"
      :pagination.sync="pagination"
      :selectedIds.sync="selectedIds"
      @show-create-modal="showCreateModal"
      @show-edit-modal="showEditModal"
      @delete-items="openConfirmDeleteModal"
    />
    <q-dialog v-model="isCreateModalOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="q-mt-md text-center">
            Заполните данные о слушателе:
          </div>
          <q-input
            clearable
            outlined
            class="input-text-field"
            clear-icon="close"
            v-model="name"
            label="Имя"
            style="width:300px"
          />
          <q-input
            clearable
            outlined
            class="input-text-field"
            clear-icon="close"
            v-model="surname"
            label="Фамилия"
            style="width:300px"
          />
          <q-input
            clearable
            outlined
            class="input-text-field"
            clear-icon="close"
            v-model="email"
            label="Email"
            style="width:300px"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" v-close-popup>Отмена</q-btn>
          <q-btn color="primary" @click="saveListener" v-close-popup>Сохранить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <ConfirmDeleteModal
      text="Вы действительно хотите удалить выбранных слушателей?"
      @delete-confirmed="deleteListeners"
      v-model="isConfirmDeleteModalOpen"
    />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Table from '../components/Table';
import Autocomplete from '../components/Autocomplete';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default {
  name: 'Listeners',
  components: {
    Table,
    Autocomplete,
    ConfirmDeleteModal,
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
      selectedIds: [],
      pagination: { rowsPerPage: 20 },
      isConfirmDeleteModalOpen: false,
      isCreateModalOpen: false,
      editingMode: false,
      id: '',
      email: '',
      name: '',
      surname: '',
    };
  },
  computed: {
    ...mapState({
      listenersList: state => state.listeners.listeners,
      listener: state => state.listeners.listener,
      loading: state => state.listeners.loading,
      seminarsList: state => state.seminars.seminars.map(seminar => ({
        label: seminar.title,
        value: seminar.id,
      })),
    }),
    ifo: {
      get() {
        return `${this.name} ${this.surname}`;
      },
      set(ifo) {
        [this.name, this.surname] = ifo.split(' ');
      },
    },
    listenersNamesList() {
      return this.listenersList.map(listener => listener.ifo);
    },
  },
  methods: {
    filterSeminarsList(val) {
      console.log(val);
      this.$store.dispatch('seminars/fetchAllSeminars', {
        filterBy: {
          field: 'title',
          value: val,
        },
      });
    },
    filterListeners(val) {
      console.log(val);
      this.$store.dispatch('listeners/fetchAllListeners', {
        filterBy: {
          field: 'seminar_id',
          value: val,
        },
      });
    },
    openConfirmDeleteModal() {
      this.isConfirmDeleteModalOpen = true;
    },
    showCreateModal() {
      this.isCreateModalOpen = true;
    },
    async showEditModal(id) {
      await this.$store.dispatch('listeners/fetchListener', id);

      this.id = this.listener.id;
      this.ifo = this.listener.ifo;
      this.email = this.listener.email;

      this.editingMode = true;
      this.isCreateModalOpen = true;
    },
    deleteListeners() {
      this.selectedIds.forEach(item => this.$store.dispatch('listeners/deleteListener', item.id));
      this.selectedIds = [];
    },
    async saveListener() {
      const {
        id, ifo, email,
      } = this;

      if (this.editingMode) {
        await this.$store.dispatch('listeners/editListener', {
          id,
          ifo,
          email,
        });
      } else {
        await this.$store.dispatch('listeners/createListener', {
          ifo,
          email,
        });
      }
      this.clearInputs();
    },
    clearInputs() {
      this.editingMode = false;
      this.name = '';
      this.surname = '';
      this.email = '';
      this.listener = {};
      this.selectedIds = [];
    },
  },
  beforeCreate() {
    this.$store.dispatch('listeners/fetchAllListeners');
    this.$store.dispatch('seminars/fetchAllSeminars');
  },
};
</script>

<style scoped>
  .input-text-field {
    margin: 10px 0;
  }
</style>
