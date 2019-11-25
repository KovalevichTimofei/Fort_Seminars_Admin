<template>
  <q-page
    v-if="listeners && !listeners.length && loading"
    class="flex justify-center flex-center"
  >
    <QSpinnerHourglass
      size="10em"
      color="primary"
      class="center"
    />
  </q-page>
  <q-page v-else class="flex column">
    <Autocomplete
      :stringOptions="seminarsOptions"
      @autocomplete-filter="filterSeminarsList"
      @make-filter="filterListeners"
    />
    <Table
      :loading="loading"
      noDataLabel="Не удалось получить список слушателей..."
      :columns="columns"
      :data="listeners"
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
import { mapState, mapGetters, mapActions } from 'vuex';
import Table from '../components/Table';
import Autocomplete from '../components/Autocomplete';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import notificationsOptions from '../mixins/notificationsOptions';

export default {
  name: 'Listeners',
  components: {
    Table,
    Autocomplete,
    ConfirmDeleteModal,
  },
  mixins: [notificationsOptions],
  data() {
    return {
      columns: [
        {
          name: 'ifo',
          required: true,
          label: 'Имя',
          field: 'ifo',
          align: 'center',
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          field: 'email',
          align: 'center',
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
    ...mapState('listeners', ['listeners', 'listener', 'loading']),
    ...mapGetters('seminars', ['seminarsOptions']),
    ifo: {
      get() {
        return `${this.name} ${this.surname}`;
      },
      set(ifo) {
        [this.name, this.surname] = ifo.split(' ');
      },
    },
    listenersNamesList() {
      return this.listeners.map(listener => listener.ifo);
    },
  },
  methods: {
    ...mapActions('listeners', [
      'fetchAllListeners',
      'fetchListener',
      'createListener',
      'editListener',
      'deleteListener',
    ]),
    ...mapActions('seminars', [
      'fetchAllSeminars',
    ]),
    filterSeminarsList(val) {
      this.fetchAllSeminars({
        filterBy: {
          field: 'title',
          value: val,
        },
      });
    },
    filterListeners(val) {
      this.fetchAllListeners({
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
      await this.fetchListener(id);

      this.id = this.listener.id;
      this.ifo = this.listener.ifo;
      this.email = this.listener.email;

      this.editingMode = true;
      this.isCreateModalOpen = true;
    },
    deleteListeners() {
      const promises = this.selectedIds.map(item => this.deleteListener(item.id));

      const dismiss = this.showNotif('pendingMessage', 'Удаление...');

      this.notifyAfterActionsSequence(
        promises,
        dismiss,
        'Удалено успешно!',
        'Не удаётся удалить!',
      );

      this.selectedIds = [];
    },
    async saveListener() {
      const {
        id, ifo, email,
      } = this;

      const dismiss = this.showNotif('pendingMessage', 'Сохранение...');

      if (this.editingMode) {
        await this.editListener({
          id,
          ifo,
          email,
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
      } else {
        await this.createListener({
          ifo,
          email,
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
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
  created() {
    this.fetchAllListeners();
    this.fetchAllSeminars();
  },
};
</script>

<style scoped>
  .input-text-field {
    margin: 10px 0;
  }
</style>
