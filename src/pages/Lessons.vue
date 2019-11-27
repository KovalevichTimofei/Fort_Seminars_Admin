<template>
  <q-page
    v-if="lessons && !lessons.length && loading"
    class="flex justify-center flex-center"
  >
    <QSpinnerHourglass
      size="10em"
      color="primary"
      class="center"
    />
  </q-page>
  <q-page v-else class="flex">
    <Table
      :loading="loading"
      noDataLabel="Не удалось получить список уроков..."
      :columns="columns"
      :data="lessons"
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
            Заполните данные об уроке:
          </div>
          <q-input
            clearable
            outlined
            ref="info"
            class="input-text-field"
            clear-icon="close"
            v-model="info"
            label="Название*"
            :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
            style="width:300px"
          />
          <q-input
            outlined
            ref="date"
            v-model="date"
            label="Дата проведения*"
            mask="date"
            :rules="['date', val => !!val || 'Это поле обязательно для заполнения.']"
            style="width:300px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            outlined
            v-model="selectedSeminarOption"
            :options="seminarsOptions"
            label="Выбор семинара"
            class="input-text-field"
            style="width:300px;"
            behavior="menu"
          />
          <q-input
            outlined
            ref="partNumb"
            v-model="partNumb"
            type="text"
            label="Порядковый номер внутри семинара*"
            :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
            style="width:300px"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" @click="clearInputs" v-close-popup>Отмена</q-btn>
          <q-btn color="primary" @click="saveLesson">Сохранить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <ConfirmDeleteModal
      text="Вы действительно хотите удалить выбранные уроки?"
      @delete-confirmed="deleteLessons"
      v-model="isConfirmDeleteModalOpen"
    />
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Table from '../components/Table';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import notificationsOptions from '../mixins/notificationsOptions';

export default {
  name: 'Lessons',
  components: {
    Table,
    ConfirmDeleteModal,
  },
  mixins: [notificationsOptions],
  data() {
    return {
      columns: [
        {
          name: 'lessonInfo',
          required: true,
          label: 'Описание',
          field: 'info',
          align: 'center',
          sortable: true,
        },
        {
          name: 'lessonDate',
          required: true,
          label: 'Дата',
          field: 'date',
          align: 'center',
          sortable: true,
        },
        {
          name: 'seminar',
          required: true,
          label: 'Семинар',
          field: 'seminar',
          align: 'center',
          sortable: true,
        },
        {
          name: 'lessonPartNumber',
          required: true,
          label: 'Номер в семинаре',
          field: 'part_numb',
          align: 'center',
          sortable: true,
        },
      ],
      pagination: { rowsPerPage: 10 },
      isConfirmDeleteModalOpen: false,
      isCreateModalOpen: false,
      editingMode: false,
      id: '',
      info: '',
      date: '',
      partNumb: '',
      selectedSeminarOption: {},
      selectedIds: [],
    };
  },
  computed: {
    ...mapState('lessons', ['lessons', 'loading']),
    ...mapGetters('seminars', ['seminarsOptions']),
  },
  methods: {
    ...mapActions('lessons', [
      'fetchAllLessons',
      'createLesson',
      'editLesson',
      'deleteLesson',
    ]),
    ...mapActions('seminars', [
      'fetchAllSeminars',
    ]),
    openConfirmDeleteModal() {
      this.isConfirmDeleteModalOpen = true;
    },
    showCreateModal() {
      this.isCreateModalOpen = true;
    },
    showEditModal(id) {
      const lesson = this.lessons.find(item => item.id === id);

      this.id = lesson.id;
      this.info = lesson.info;
      this.date = lesson.date;
      this.partNumb = lesson.part_numb;

      this.selectedSeminarOption.value = lesson.seminar_id;
      this.selectedSeminarOption.label = lesson.seminar;

      this.editingMode = true;
      this.isCreateModalOpen = true;
    },
    deleteLessons() {
      const promises = this.selectedIds.map(item => this.deleteLesson(item.id));

      const dismiss = this.showNotif('pendingMessage', 'Удаление...');

      this.notifyAfterActionsSequence(
        promises,
        dismiss,
        'Удалено успешно!',
        'Не удаётся удалить!',
      );

      this.selectedIds = [];
    },
    async saveLesson() {
      const {
        id, info, date, partNumb, selectedSeminarOption,
      } = this;

      if (this.detectNotValidInputs()) {
        return;
      }

      const dismiss = this.showNotif('pendingMessage', 'Сохранение...');

      if (this.editingMode) {
        this.editLesson({
          id, info, date, part_numb: partNumb, seminar_id: selectedSeminarOption.value, seminar: selectedSeminarOption.label,
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
      } else {
        this.createLesson({
          info, date, part_numb: partNumb, seminar_id: selectedSeminarOption.value, seminar: selectedSeminarOption.label,
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
      }

      this.isCreateModalOpen = false;
      this.clearInputs();
    },
    detectNotValidInputs() {
      if (!this.selectedSeminarOption.value) {
        return true;
      }

      this.$refs.info.validate();
      this.$refs.date.validate();
      this.$refs.partNumb.validate();

      return this.$refs.info.hasError
        || this.$refs.date.hasError
        || this.$refs.partNumb.hasError;
    },
    clearInputs() {
      this.editingMode = false;
      this.id = '';
      this.info = '';
      this.date = '';
      this.partNumb = '';
      this.selectedSeminarOption = {};
      this.lesson = {};
      this.selectedIds = [];
    },
  },
  created() {
    this.fetchAllLessons();
    this.fetchAllSeminars();
  },
};
</script>

<style scoped>
  .input-text-field {
    margin: 10px 0;
  }
</style>
