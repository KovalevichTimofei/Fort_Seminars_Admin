<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card>
      <q-card-section class="column items-center">
        <q-avatar icon="priority_high" color="negative" text-color="white" />
        <span class="q-ml-sm q-mt-md">{{text}}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn flat label="Удалить" color="negative" @click="emitDeleteConfirmed" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ConfirmDeleteModal',
  model: {
    prop: 'isOpen',
    event: 'input',
  },
  props: ['text', 'isOpen'],
  computed: {
    isModalOpen: {
      get() {
        return this.isOpen;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    emitDeleteConfirmed() {
      this.$emit('delete-confirmed');
    },
  },
};
</script>

<style scoped>

</style>
