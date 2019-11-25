<template>
  <q-page
    v-if="seminars && !seminars.length && loading"
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
      noDataLabel="Не удалось получить список семинаров..."
      :columns="columns"
      :data="seminars"
      row_key="id"
      @show-create-modal="isStepperOpen = true"
      @show-edit-modal="showEditModal"
      @delete-items="openConfirmDeleteModal"
      :pagination="{rowsPerPage: 20}"
      :selectedIds.sync="selectedIds"
    />
    <q-dialog v-model="isStepperOpen">
      <q-stepper
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        color="primary"
        animated
        v-model="step"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        height="auto"
        navigation
        padding
        class="bg-white shadow-1 rounded-borders"
        ref="createSeminarStepper"
      >
        <q-step
          :name="1"
          class="column no-wrap flex-center"
          title="Семинар"
          icon="school"
        >
          <q-icon name="school" color="primary" size="56px" class="block"/>
          <div
            style="height:464px;"
            class="flex column justify-between q-pa-md"
          >
            <div>
              <div class="q-mt-md text-center">
                Заполните данные о семинаре:
              </div>
              <q-input
                clearable
                outlined
                ref="title"
                class="input-text-field"
                clear-icon="close"
                v-model="title"
                label="Название*"
                :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
                style="width:300px"
              />
              <q-input
                clearable
                outlined
                class="input-text-field"
                clear-icon="close"
                v-model="inviteLink"
                label="Видеоприглашение"
                style="width:300px"
              />
            </div>
          </div>
        </q-step>
        <q-step
          :name="2"
          class="column no-wrap flex-center"
          title="Уроки"
          icon="school"
        >
          <q-icon name="school" color="primary" size="56px" class="block"/>
          <div
            style="height:464px;"
            class="flex column justify-between q-pa-md"
          >
            <div>
              <div class="q-mt-md text-center">
                Заполните данные о уроках:
              </div>
              <q-list>
                <q-item
                  :key="i"
                  v-for="i in lessonsNumber"
                  style="border: 1px solid rgba(0, 0, 0, 0.24); border-radius: 5px"
                  class="q-ma-md"
                >
                  <q-item-section avatar>
                    Урок {{i}}
                    <q-input
                      clearable
                      outlined
                      type="text"
                      class="input-text-field"
                      clear-icon="close"
                      label="Название*"
                      :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
                      @input="lessonDataInput($event, 'info', i)"
                      :value="lessonsListForCurSeminar[i-1].info"
                      style="width:300px"
                    />
                    <q-input
                      outlined
                      @input="lessonDataInput($event, 'date', i)"
                      label="Дата проведения*"
                      mask="date"
                      :value="lessonsListForCurSeminar[i-1].date"
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
                              :value="lessonsListForCurSeminar[i-1].date"
                              @input="inputDate($event, i)"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
                <q-btn
                  outline
                  color="primary"
                  icon="add"
                  class="q-mx-xl"
                  style="width:300px"
                  @click="addLesson"
                />
              </q-list>
            </div>
          </div>
        </q-step>
        <q-step
          :name="3"
          class="column no-wrap flex-center"
          title="Проповедник"
          icon="record_voice_over"
        >
          <q-icon name="record_voice_over" color="primary" size="56px" class="block" />
          <q-tabs
            v-model="tab"
            class="text-teal"
            @input="tabChanged"
          >
            <q-tab name="choose" icon="how_to_reg" label="Выбрать" />
            <q-tab name="create" icon="add" label="Создать" />
          </q-tabs>
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="choose">
              <div
                style="height:380px;width:300px;"
                class="flex column justify-between"
              >
                <q-select
                  outlined
                  v-model="preacherId"
                  :options="preachersOptions"
                  label="Выбор проповедника"
                  :hint="createPreacherHint"
                  style="width:300px;"
                  behavior="menu"
                  @input="readPreacherInfo"
                />
              </div>
            </q-tab-panel>
            <q-tab-panel name="create">
              <div class="q-mt-md text-center">
                Заполните данные о проповеднике:
              </div>
              <q-input
                clearable
                outlined
                ref="name"
                class="input-text-field"
                clear-icon="close"
                v-model="name"
                label="Имя*"
                :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
                style="width:300px"
              />
              <q-input
                clearable
                outlined
                ref="surname"
                class="input-text-field"
                clear-icon="close"
                v-model="surname"
                label="Фамилия*"
                :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
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
                v-model="preacherInfo"
                type="textarea"
                label="Информация о проповеднике"
                style="width:300px"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-step>
        <q-step
          :name="4"
          class="column no-wrap flex-center"
          title=""
          icon="fas fa-flag-checkered"
        >
          <q-icon name="fas fa-flag-checkered" color="primary" size="56px" class="block" />
          <div
            style="height:464px;"
            class="q-pa-md"
          >
            <q-list
              bordered
              class="rounded-borders"
            >
              <q-expansion-item
                switch-toggle-side
                expand-separator
                icon="school"
                label="Инфо семинара"
              >
                <q-card>
                  <q-card-section>
                    <q-input
                      outlined
                      disabled
                      ref="titleConclusion"
                      label="Название*"
                      :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
                      v-model="title"
                      style="width:100%"
                    >
                    </q-input>
                    <div class="q-ma-md">
                      Видеоприглашение:
                    </div>
                    <q-video
                      :src="inviteLink"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                switch-toggle-side
                expand-separator
                icon="record_voice_over"
                label="Уроки"
              >
                <q-card>
                  <q-card-section>
                    <q-table
                      title="Уроки"
                      :data="lessonsData"
                      :columns="lessonsColumns"
                      row-key="number"
                    >
                      <template v-slot:body-cell="props">
                        <q-td>
                          <p class="limited">
                            {{props.value}}
                          </p>
                        </q-td>
                      </template>
                    </q-table>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                switch-toggle-side
                expand-separator
                icon="record_voice_over"
                label="Проповедник"
              >
                <q-card>
                  <q-card-section>
                    <q-input
                      outlined
                      disabled
                      ref="ifoConclusion"
                      label="Имя, фамилия*"
                      :rules="[val => !!val || 'Это поле обязательно для заполнения.']"
                      v-model="ifo"
                      style="width:100%"
                      class="q-my-md"
                    >
                    </q-input>
                    <q-input
                      outlined
                      disabled
                      label="Ссылка на фото"
                      v-model="photoUrl"
                      style="width:100%"
                      class="q-my-md"
                    >
                    </q-input>
                    <div class="row flex-center justify-around">
                      <div>Фото по введённой <br/> ссылке:</div>
                      <q-avatar>
                        <img :src="photoUrl">
                      </q-avatar>
                    </div>
                    <q-input
                      outlined
                      v-model="preacherInfo"
                      type="textarea"
                      label="Информация о проповеднике"
                      style="width:100%"
                      class="q-my-md"
                    />
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="step === 4 ? saveSeminar() : $refs.createSeminarStepper.next()"
              color="primary"
              :label="step === 4 ? 'Завершить' : 'Далее'"
            />
            <q-btn
              v-if="step > 1"
              flat color="primary"
              @click="$refs.createSeminarStepper.previous()"
              label="Назад"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-dialog>
    <ConfirmDeleteModal
      text="Вы действительно хотите удалить выбранные семинары и связанные с ними уроки?"
      @delete-confirmed="deleteSeminars(selectedIds)"
      v-model="isConfirmDeleteModalOpen"
    />
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Table from '../components/Table';
import { generateId } from '../plugins/decoder';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import notificationsOptions from '../mixins/notificationsOptions';

export default {
  name: 'Seminars',
  components: {
    Table,
    ConfirmDeleteModal,
  },
  mixins: [notificationsOptions],
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
          field: 'lessonsListForCurSeminar',
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
      selectedIds: [],
      isStepperOpen: false,
      editingMode: false,
      step: 1,
      createPreacherHint: 'Если требуемого проповедника нет в списке, то перейдите во вкладку «Создать»',
      lessonsNumber: 1,
      tab: 'choose',
      title: '',
      inviteLink: '',
      preacherId: {},
      name: '',
      surname: '',
      photoUrl: '',
      preacherInfo: '',
      lessonsListForCurSeminar: [{ info: '', date: '' }],
      date: '',
      lessonsColumns: [
        {
          name: 'number', label: 'Номер', field: 'number',
        },
        {
          name: 'info', label: 'Название', field: 'info',
        },
        {
          name: 'date', label: 'Дата', field: 'date',
        },
      ],
      isConfirmDeleteModalOpen: false,
    };
  },
  computed: {
    ...mapState('seminars', ['seminars', 'loading', 'seminar']),
    ...mapState('lessons', ['lessons']),
    ...mapState('preachers', ['preacher', 'preachers']),
    ...mapGetters('preachers', ['preachersOptions']),
    ifo: {
      get() {
        return `${this.name} ${this.surname}`;
      },
      set(ifo) {
        [this.name, this.surname] = ifo.split(' ');
      },
    },
    lessonsData() {
      return this.lessonsListForCurSeminar.map((el, i) => ({
        number: i + 1,
        info: el.info,
        date: new Date(el.date.split('/').join('-')).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
    },
  },
  methods: {
    ...mapActions('seminars', [
      'fetchAllSeminars',
      'fetchSeminarById',
      'createSeminar',
      'editSeminar',
      'deleteSeminar',
    ]),
    ...mapActions('preachers', [
      'fetchAllPreachers',
      'fetchCurrentPreacher',
    ]),
    ...mapActions('lessons', [
      'fetchLessonsBySeminar',
    ]),
    readPreacherInfo() {
      const preacher = this.preachers.find(item => item.id === this.preacherId.value);
      this.ifo = preacher.ifo;
      this.photoUrl = preacher.photo_url;
      this.preacherInfo = preacher.preacherInfo;
    },
    async saveSeminar() {
      const {
        ifo, photoUrl, preacherInfo, title, inviteLink,
      } = this;

      const preacher = this.preacherId.value
        ? { id: this.preacherId.value }
        : {
          ifo,
          photoUrl,
          info: preacherInfo,
        };

      if (this.detectNotValidInputs()) {
        return;
      }

      const dismiss = this.showNotif('pendingMessage', 'Сохранение...');

      if (this.editingMode) {
        await this.editSeminar({
          seminar: {
            ...this.seminar,
            title,
            invite_link: inviteLink,
          },
          preacher,
          lessons: this.lessonsListForCurSeminar.map((el) => {
            const id = el.id || generateId();

            return {
              ...el,
              seminar_id: this.seminar.id,
              id,
            };
          }),
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
      } else {
        const seminarId = generateId();

        await this.createSeminar({
          seminar: {
            id: seminarId,
            title,
            invite_link: inviteLink,
          },
          preacher,
          lessons: this.lessonsListForCurSeminar.map(el => ({
            ...el,
            seminar_id: seminarId,
            id: generateId(),
          })),
        })
          .then(() => {
            this.showNotif('successMessage', 'Сохранено!');
          })
          .catch(() => {
            this.showNotif('failMessage', 'Сохранить не удаётся!');
          })
          .finally(() => dismiss());
      }

      this.isStepperOpen = false;
      this.clearInputs();
    },
    async showEditModal(id) {
      await this.fetchSeminarById(id);
      await this.fetchCurrentPreacher(this.seminar.preacher_id);
      await this.fetchLessonsBySeminar(id);

      this.editingMode = true;

      this.step = 1;
      this.tab = 'choose';

      this.title = this.seminar.title;
      this.inviteLink = this.seminar.invite_link;

      this.preacherId.value = this.preacher.id;
      this.preacherId.label = this.preacher.ifo;

      this.lessonsNumber = this.lessons.length;
      this.lessonsListForCurSeminar = this.lessons;
      this.lessonsColumns = [
        {
          name: 'number', label: 'Номер', field: 'number',
        },
        {
          name: 'info', label: 'Название', field: 'info',
        },
        {
          name: 'date', label: 'Дата', field: 'date',
        },
      ];

      this.isStepperOpen = true;
    },
    openConfirmDeleteModal() {
      this.isConfirmDeleteModalOpen = true;
    },
    deleteSeminars() {
      const promises = this.selectedIds.map(item => this.deleteSeminar(item.id));

      const dismiss = this.showNotif('pendingMessage', 'Удаление...');

      this.notifyAfterActionsSequence(
        promises,
        dismiss,
        'Удалено успешно!',
        'Не удаётся удалить!',
      );

      this.selectedIds = [];
    },
    lessonDataInput(value, field, lessonNumber) {
      const index = lessonNumber - 1;
      this.lessonsListForCurSeminar.splice(index, 1, {
        ...this.lessonsListForCurSeminar[index],
        [field]: value,
      });
    },
    inputDate(value, i) {
      this.lessonDataInput(value, 'date', i);
      this.$refs.qDateProxy[i - 1].hide();
    },
    addLesson() {
      this.lessonsNumber += 1;
      this.lessonsListForCurSeminar.push({ info: '', date: '' });
    },
    tabChanged(value) {
      if (value === 'create') {
        this.preacherId = {};
      }
    },
    detectNotValidInputs() {
      if (!this.lessonsListForCurSeminar.some(el => !el.info || !el.date)) {
        return true;
      }

      this.$refs.name.validate();
      this.$refs.surname.validate();
      this.$refs.title.validate();
      this.$refs.titleConclusion.validate();
      this.$refs.ifoConclusion.validate();

      return this.$refs.name.hasError
        || this.$refs.surname.hasError
        || this.$refs.title.hasError
        || this.$refs.titleConclusion.hasError
        || this.$refs.ifoConclusion.hasError;
    },
    clearInputs() {
      this.step = 1;
      this.lessonsNumber = 1;
      this.tab = 'choose';
      this.title = '';
      this.inviteLink = '';
      this.preacherId = {};
      this.name = '';
      this.surname = '';
      this.photoUrl = '';
      this.preacherInfo = '';
      this.lessonsListForCurSeminar = [{ info: '', date: '' }];
      this.date = '';
      this.selectedIds = [];
    },
  },
  created() {
    this.fetchAllSeminars();
    this.fetchAllPreachers();
  },
};
</script>

<style scoped lang="scss">
  .input-text-field {
    margin: 10px 0;
  }
  .block {
    margin: 0 auto;
  }
  .limited {
    max-width: 200px;
    white-space: normal;
    text-align: left;
  }
</style>
