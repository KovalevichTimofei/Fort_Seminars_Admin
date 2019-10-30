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
            style="height:546px;"
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
            <q-btn
              style="width:300px"
              class="self-end"
              color="primary"
              @click="$refs.createSeminarStepper.next()"
            >
              Далее
            </q-btn>
          </div>
        </q-step>
        <q-step
          :name="2"
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
                style="height:442px;width:300px;"
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
                />
                <div>
                  <q-btn
                    style="width:145px;margin-right:10px"
                    color="primary"
                    @click="$refs.createSeminarStepper.previous()"
                  >
                    Назад
                  </q-btn>
                  <q-btn
                    style="width:145px"
                    color="primary"
                    @click="$refs.createSeminarStepper.next()"
                  >
                    Далее
                  </q-btn>
                </div>
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
              <div class="q-mt-md">
                <q-btn
                  style="width:145px;margin-right:10px"
                  color="primary"
                  @click="$refs.createSeminarStepper.previous()"
                >
                  Назад
                </q-btn>
                <q-btn
                  style="width:145px"
                  color="primary"
                  @click="$refs.createSeminarStepper.next()"
                >
                  Далее
                </q-btn>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-step>
        <q-step
          :name="3"
          class="column no-wrap flex-center"
          title="Обобщение"
          icon="fas fa-flag-checkered"
        >
          <q-icon name="fas fa-flag-checkered" color="primary" size="56px" class="block" />
          <div
            style="height:546px;width:300px"
            class="q-pa-md"
          >
            <q-list
              bordered
              class="rounded-borders"
            >
              <q-expansion-item
                switch-toggle-side
                expand-separator
                icon="perm_identity"
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
                icon="signal_wifi_off"
                label="Проповедник"
              >
                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                    commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                    eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn @click="$refs.createSeminarStepper.next()" color="primary" :label="step === 3 ? 'Завершить' : 'Далее'" />
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
      tab: 'choose',
      address: '',
      title: '',
      invite_link: '',
      preacher_id: '',
      name: '',
      surname: '',
      photo_url: '',
      preacher_info: '',
    };
  },
  computed: {
    ...mapState({
      seminarsList: state => state.seminars.seminars,
      loading: state => state.seminars.loading,
      preachersList: state => state.preachers.preachers.map(preacher => ({
        label: preacher.ifo,
        value: preacher.id,
      })),
    }),
  },
  beforeCreate() {
    this.$store.dispatch('seminars/fetchAllSeminars');
    this.$store.dispatch('preachers/fetchAllPreachers');
  },
};
</script>

<style scoped>
  .input-text-field {
    margin: 10px 0;
  }
  .block {
    margin: 0 auto;
  }
</style>
