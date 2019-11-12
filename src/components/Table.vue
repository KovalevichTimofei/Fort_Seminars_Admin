<template>
  <div class="q-pa-md">
    <q-table
      :data="data"
      :columns="columns"
      :row-key="row_key"
      selection="multiple"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
      :pagination="pagination"
    >

      <template v-slot:top>
        <div class="top-not-selected" v-show="selected.length === 0">
          <q-btn color="primary" @click="emitCreate">Создать</q-btn>
        </div>
        <div class="top-when-selected" v-show="selected.length === 1">
          <div>{{getSelectedString()}}</div>
          <div class="btns">
            <q-btn color="secondary">Редактировать</q-btn>
            <q-btn color="negative" @click="emitDelete">Удалить</q-btn>
          </div>
        </div>
        <div class="top-when-selected" v-show="selected.length > 1">
          <div>{{getSelectedString()}}</div>
          <div class="btns">
            <q-btn color="negative" @click="emitDelete">Удалить</q-btn>
          </div>
        </div>
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
    'columns', 'data', 'row_key', 'pagination',
  ],
  methods: {
    getSelectedString() {
      return this.selected.length === 0 ? '' : `Выбрано ${this.selected.length} из ${this.data.length}`;
    },
    emitCreate() {
      this.$emit('show-create-modal');
    },
    emitDelete() {
      this.$emit('delete-items', this.selected.map(el => el.id));
      this.selected = [];
    },
  },
};
</script>

<style scoped lang="scss">
  .limited {
    max-width: 800px;
    white-space: normal;
    text-align: left;
  }
  .top-not-selected {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .top-when-selected {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btns button {
    margin: 0 10px;
  }
</style>
