<template>
  <q-page class="flex">
    <Table
      :columns="columns"
      :data="preachers"
      row_key="id"
      :pagination.sync=pagination
      :selectedIds.sync="selectedIds"
      @show-create-modal="showCreateModal"
      @show-edit-modal="showEditModal"
      @delete-items="openConfirmDeleteModal"
    />
    <q-dialog v-model="isCreateModalOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="q-mt-md text-center">
            Заполните данные о проповеднике:
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
            v-model="photoUrl"
            label="Ссылка на фото"
            style="width:300px"
          />
          <q-input
            outlined
            v-model="info"
            type="textarea"
            label="Информация о проповеднике"
            style="width:300px"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" v-close-popup>Отмена</q-btn>
          <q-btn color="primary" @click="savePreacher" v-close-popup>Сохранить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <ConfirmDeleteModal
      text="Вы действительно хотите удалить выбранных проповедников?"
      @delete-confirmed="deletePreachers"
      v-model="isConfirmDeleteModalOpen"
    />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Table from '../components/Table';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import notificationsOptions from '../mixins/notificationsOptions';

const { mapState, mapActions } = createNamespacedHelpers('preachers');

export default {
  name: 'Preachers',
  components: {
    Table,
    ConfirmDeleteModal,
  },
  mixins: [notificationsOptions],
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
          name: 'preacherInfo',
          required: true,
          label: 'Описание',
          field: 'info',
          align: 'center',
          sortable: false,
        },
      ],
      pagination: { rowsPerPage: 20 },
      isConfirmDeleteModalOpen: false,
      isCreateModalOpen: false,
      editingMode: false,
      name: '',
      surname: '',
      photoUrl: '',
      info: '',
      selectedIds: [],
    };
  },
  computed: {
    ...mapState(['preachers', 'preacher', 'loading']),
    ifo: {
      get() {
        return `${this.name} ${this.surname}`;
      },
      set(ifo) {
        [this.name, this.surname] = ifo.split(' ');
      },
    },
  },
  methods: {
    ...mapActions([
      'fetchCurrentPreacher',
      'deletePreacher',
      'editPreacher',
      'createPreacher',
      'fetchAllPreachers',
    ]),
    openConfirmDeleteModal() {
      this.isConfirmDeleteModalOpen = true;
    },
    showCreateModal() {
      this.isCreateModalOpen = true;
    },
    async showEditModal(id) {
      await this.fetchCurrentPreacher(id);

      this.ifo = this.preacher.ifo;
      this.info = this.preacher.info;
      this.photoUrl = this.preacher.photo_url;
      this.editingMode = true;

      this.isCreateModalOpen = true;
    },
    deletePreachers() {
      const promises = this.selectedIds.map(item => this.deletePreacher(item.id));

      const pending = this.showNotif('pendingMessage', 'Удаление...');

      Promise.all(promises)
        .then(() => {
          pending();
          this.showNotif('successMessage', 'Удалено успешно!');
        })
        .catch(() => {
          pending();
          this.showNotif('failMessage', 'Не удаётся удалить!');
        });

      this.selectedIds = [];
    },
    async savePreacher() {
      const {
        ifo, photoUrl, info,
      } = this;

      const dismiss = this.showNotif('pendingMessage', 'Сохранение...');

      if (this.editingMode) {
        this.editPreacher({
          id: this.preacher.id,
          ifo,
          info,
          photo_url: photoUrl,
        })
          .then(() => {
            dismiss();
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            dismiss();
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          });
      } else {
        this.createPreacher({
          ifo,
          info,
          photo_url: photoUrl,
        })
          .then(() => {
            dismiss();
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            dismiss();
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          });
      }

      this.clearInputs();
    },
    clearInputs() {
      this.editingMode = false;
      this.name = '';
      this.surname = '';
      this.photoUrl = '';
      this.info = '';
      this.preacher = {};
      this.selectedIds = [];
    },
  },
  created() {
    this.fetchAllPreachers();
  },

};
</script>

<style scoped>
  .input-text-field {
    margin: 10px 0;
  }
</style>
