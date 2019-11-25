<template>
  <div class="q-pa-md">
    <q-table
      virtual-scroll
      :loading="loading"
      :no-data-label="noDataLabel"
      :data="data"
      :columns="columns"
      :row-key="row_key"
      selection="multiple"
      :selected.sync="selectedArr"
      :selected-rows-label="getSelectedString"
      :pagination.sync="paginationObj"
      table-style="max-height: 600px"
    >

      <template v-slot:top>
        <div class="top-not-selected" v-show="selectedArr.length === 0">
          <q-btn color="primary" @click="emitCreate">Создать</q-btn>
        </div>
        <div class="top-when-selected" v-show="selectedArr.length === 1">
          <div>{{getSelectedString()}}</div>
          <div class="btns">
            <q-btn color="secondary" @click="emitEdit">Редактировать</q-btn>
            <q-btn color="negative" @click="emitDelete">Удалить</q-btn>
          </div>
        </div>
        <div class="top-when-selected" v-show="selectedArr.length > 1">
          <div>{{getSelectedString()}}</div>
          <div class="btns">
            <q-btn color="negative" @click="emitDelete">Удалить</q-btn>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-preacherInfo="props">
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
            <img alt="портрет" :src="props.value">
          </q-avatar>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    columns: Array,
    data: Array,
    row_key: String,
    pagination: Object,
    selectedIds: Array,
    loading: Boolean,
    noDataLabel: String,
  },
  computed: {
    selectedArr: {
      get() {
        return this.selectedIds;
      },
      set(selectedArr) {
        this.$emit('update:selectedIds', selectedArr);
      },
    },
    paginationObj: {
      get() {
        return this.pagination;
      },
      set(obj) {
        this.$emit('update:pagination', obj);
      },
    },
  },
  methods: {
    getSelectedString() {
      return this.selectedArr.length === 0 ? '' : `Выбрано ${this.selectedArr.length} из ${this.data.length}`;
    },
    emitCreate() {
      this.$emit('show-create-modal');
    },
    emitEdit() {
      this.$emit('show-edit-modal', this.selectedArr[0].id);
    },
    emitDelete() {
      this.$emit('delete-items', this.selectedArr.map(el => el.id));
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
