<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        outlined
        clearable
        clear-icon="close"
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="stringOptions"
        @filter="filterFn"
        @input="inputFn"
        hint="Фильтр по семинарам"
        style="width: 100%; padding-bottom: 32px"
        behavior="menu"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Не найдено
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Autocomplete',
  props: {
    stringOptions: Array,
  },
  data() {
    return {
      model: null,
      hide: false,
    };
  },
  methods: {
    filterFn(val, update) {
      update(() => {
        // console.log('update', val);
        this.$emit('autocomplete-filter', val);
      });
    },
    inputFn() {
      this.$emit('make-filter', this.model.value);
    },
  },
};
</script>

<style scoped>

</style>
