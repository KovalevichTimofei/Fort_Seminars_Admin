<template>
  <q-page class="flex">
    <Table
      :columns="columns"
      :data="seminarsList"
      row_key="title"
      @show-create-modal="stepper = true"
    />
    <q-dialog v-model="stepper">
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
                class="input-text-field"
                clear-icon="close"
                v-model="title"
                label="Название"
                style="width:300px"
              />
              <q-input
                clearable
                outlined
                class="input-text-field"
                clear-icon="close"
                v-model="invite_link"
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
                      label="Название"
                      @input="lessonDataInput($event, 'info', i)"
                      :value="lessons[i-1].info"
                      style="width:300px"
                    />
                    <q-input
                      outlined
                      @input="lessonDataInput($event, 'date', i)"
                      mask="date"
                      :value="lessons[i-1].date"
                      :rules="['date']"
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
                              :value="lessons[i-1].date"
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
                  v-model="preacher_id"
                  :options="preachersList"
                  label="Выбор проповедника"
                  hint="Если требуемого проповедника нет в списке, то перейдите во вкладку «Создать»"
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
                v-model="photo_url"
                label="Ссылка на фото"
                style="width:300px"
              />
              <q-input
                outlined
                v-model="preacher_info"
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
                      label="Название"
                      v-model="title"
                      style="width:100%"
                    >
                    </q-input>
                    <div class="q-ma-md">
                      Видеоприглашение:
                    </div>
                    <q-video
                      :src="invite_link"
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
                      label="Имя, фамилия"
                      v-model="ifo"
                      style="width:100%"
                      class="q-my-md"
                    >
                    </q-input>
                    <q-input
                      outlined
                      disabled
                      label="Ссылка на фото"
                      v-model="photo_url"
                      style="width:100%"
                      class="q-my-md"
                    >
                    </q-input>
                    <div class="row flex-center justify-around">
                      <div>Фото по введённой <br/> ссылке:</div>
                      <q-avatar>
                        <img :src="photo_url">
                      </q-avatar>
                    </div>
                    <q-input
                      outlined
                      v-model="preacher_info"
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
            <q-btn @click="step === 4 ? saveSeminar() : $refs.createSeminarStepper.next()" color="primary" :label="step === 4 ? 'Завершить' : 'Далее'" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.createSeminarStepper.previous()" label="Назад" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-dialog>
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
      stepper: false,
      step: 1,
      lessonsNumber: 1,
      tab: 'choose',
      title: '',
      invite_link: '',
      preacher_id: '',
      name: '',
      surname: '',
      photo_url: '',
      preacher_info: '',
      lessons: [{ info: '', date: '' }],
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
    };
  },
  computed: {
    ...mapState({
      seminarsList: state => state.seminars.seminars,
      loading: state => state.seminars.loading,
      preachersListInfo: state => state.preachers.preachers,
      preachersList: state => state.preachers.preachers.map(preacher => ({
        label: preacher.ifo,
        value: preacher.id,
      })),
      preacher: state => state.preacher,
    }),
    ifo: {
      get() {
        return `${this.name} ${this.surname}`;
      },
      set(ifo) {
        const names = ifo.split(' ');
        this.name = names[0];
        this.surname = names[names.length - 1];
      },
    },
    lessonsData() {
      return this.lessons.map((el, i) => ({
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
    readPreacherInfo() {
      const preacher = this.preachersListInfo.find(item => item.id === this.preacher_id.value);
      this.ifo = preacher.ifo;
      this.photo_url = preacher.photo_url;
      this.preacher_info = preacher.preacher_info;
    },
    async saveSeminar() {
      const {
        ifo, photo_url, preacher_info, title, invite_link,
      } = this;

      const preacher = this.preacher_id.value
        ? { id: this.preacher_id.value }
        : {
          ifo, photo_url, preacher_info, invite_link,
        };

      await this.$store.dispatch('seminars/createSeminar', {
        seminar: {
          id: `${title} ${invite_link}`,
          title,
          invite_link,
        },
        preacher,
        lessons: this.lessons.map((el, i) => ({
          ...el,
          seminar_id: `${title} ${invite_link}`,
          id: `${i + 1} ${el.info}`,
        })),
      });
    },
    lessonDataInput(value, field, lessonNumber) {
      const index = lessonNumber - 1;
      this.lessons.splice(index, 1, {
        ...this.lessons[index],
        [field]: value,
      });
    },
    inputDate(value, i) {
      this.lessonDataInput(value, 'date', i);
      this.$refs.qDateProxy[i - 1].hide();
    },
    addLesson() {
      this.lessonsNumber += 1;
      this.lessons.push({ info: '', date: '' });
    },
  },
  beforeCreate() {
    this.$store.dispatch('seminars/fetchAllSeminars');
    this.$store.dispatch('preachers/fetchAllPreachers');
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