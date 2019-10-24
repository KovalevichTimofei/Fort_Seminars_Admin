<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      :row-key="row_key"
      selection="multiple"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
    >

      <template v-slot:top>
        Top
      </template>

      <template v-slot:body-cell-preacher_info="props">
        <q-td :props="props">
          <p class="limited">
            {{props.value}}
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-lessons="props">
          <q-td>
            <span :key="prop" v-for="(prop, i) in props.value">
              {{`${i+1}) ${prop}`}}
              <br/>
            </span>
          </q-td>
      </template>

      <template v-slot:body-cell-avatar="props">
        <q-td>
          <q-avatar size="80px">
            <img :src="props.value">
          </q-avatar>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      selected: [],
    };
  },
  props: [
    'columns', 'data', 'row_key',
  ],
  methods: {
    getSelectedString() {
      return this.selected.length === 0 ? '' : `Выбрано ${this.selected.length} из ${this.data.length}`;
    },
  },
};
</script>

<style scoped>
  .limited {
    max-width: 200px;
    white-space: normal;
    text-align: left;
  }
</style>
