<template>
  <div class="q-mb-xl q-pb-md">
    <q-table
      :title="tableTitle"
      :columns="columns"
      :pagination.sync="pagination"
      :data="data"
      selection="single"
      :selected.sync="selected"
      :filter="filter"
      :separator="separator"
    >
      <template v-if="selected.length == 0" slot="top">
        <q-btn
          dense
          icon="add_circle"
          size="14px"
          color="white"
          text-color="secondary"
          :label="$t('dynamicTable.add')"
          @click="$emit('addItem')"
        >
          <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
            {{ $t('dynamicTable.addToolTip') }}
          </q-tooltip>
        </q-btn>
        <q-input v-model="filter" class="table-search" dense debounce="300" :placeholder="$t('dynamicTable.search')">
          <template v-if="!filter" v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-if="filter" v-slot:append>
            <q-icon name="close" class="cursor-pointer" @click="filter = ''" />
          </template>
        </q-input>
        <q-space />
        <h5 class="table-title">{{ tableTitle }}</h5>
        <q-space />
        <q-select
          v-show="topRightOptions.cellLines && mode === 'list'"
          v-model="separator"
          :color="color"
          borderless
          dense
          :options="separatorOptions"
          emit-value
          map-options
          hide-underline
        />
      </template>
      <template slot="top-selection">
        <q-btn class="edit" dense color="white" text-color="deep-orange" icon="edit" :disable="loading" @click="editItem">
          <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
            {{ $t('dynamicTable.editToolTip') }}
          </q-tooltip>
        </q-btn>
        <q-btn class="delete" dense color="white" text-color="deep-orange" icon="delete" :disable="loading" @click="deleteItem">
          <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
            {{ $t('dynamicTable.deleteToolTip') }}
          </q-tooltip>
        </q-btn>
        <q-btn class="delete" dense color="white" text-color="deep-orange" icon="remove_red_eye" :disable="loading" @click="showItem">
          <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
            {{ $t('dynamicTable.showToolTip') }}
          </q-tooltip>
        </q-btn>
        <q-input v-model="filter" class="table-search" dense debounce="300" :placeholder="$t('dynamicTable.search')">
          <template v-if="!filter" v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-if="filter" v-slot:append>
            <q-icon name="close" class="cursor-pointer" @click="filter = ''" />
          </template>
        </q-input>
        <q-space />
        <h5 class="table-title">{{ tableTitle }}</h5>
        <q-space />
        <q-select
          v-show="topRightOptions.cellLines && mode === 'list'"
          v-model="separator"
          :color="color"
          borderless
          dense
          :options="separatorOptions"
          emit-value
          map-options
          hide-underline
        />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :class="'cursor-pointer'" @click.native="props.selected = !props.selected">
          <q-popup-proxy v-if="props.selected == 1" context-menu>
            <q-banner>
              <q-btn class="edit" dense color="white" text-color="deep-orange" icon="edit" :disable="loading" @click="editItem">
                <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
                  {{ $t('dynamicTable.editToolTip') }}
                </q-tooltip>
              </q-btn>
              <q-btn class="delete" dense color="white" text-color="deep-orange" icon="delete" :disable="loading" @click="deleteItem">
                <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
                  {{ $t('dynamicTable.deleteToolTip') }}
                </q-tooltip>
              </q-btn>
              <q-btn class="delete" dense color="white" text-color="deep-orange" icon="remove_red_eye" :disable="loading" @click="showItem">
                <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[5, 5]">
                  {{ $t('dynamicTable.showToolTip') }}
                </q-tooltip>
              </q-btn>
            </q-banner>
          </q-popup-proxy>
          <q-td auto-width>
            <q-checkbox v-if="selectionCheckBox" v-model="props.selected" color="deep-orange" />
            <!--            <span v-else />-->
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    {{ selected }}
  </div>
</template>

<script>
export default {
  name: 'DynamicTable',
  props: {
    tableTitle: {
      type: String,
    },
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: [Array, Object],
      required: true,
    },
    searchInputPlaceholder: {
      type: String,
      default: 'Search',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    topRightOptions: {
      type: Object,
      default: () => {
        return {
          visibleCols: true,
          cellLines: true,
          fullscreenToggle: true,
        };
      },
    },
  },
  data() {
    return {
      filter: '',
      selected: [],
      selectionCheckBox: false,
      separator: 'horizontal',
      mode: 'list',
      color: 'orange',
      separatorOptions: [
        { label: this.$t('dynamicTable.horizontal'), value: 'horizontal' },
        { label: this.$t('dynamicTable.vertical'), value: 'vertical' },
        { label: this.$t('dynamicTable.cell'), value: 'cell' },
        { label: this.$t('dynamicTable.horizontal'), value: 'none' },
      ],
      pagination: { rowsPerPage: 10, page: 1 },
    };
  },
  computed: {},
  watch: {},
  methods: {
    showItem() {
      const item = this.selected[0];
      this.$emit('showItem', item.id);
      this.selected = [];
    },
    deleteItem() {
      const item = this.selected[0];
      this.$emit('deleteItem', item.id, item.name);
      this.selected = [];
    },
    editItem() {
      const item = this.selected[0];
      this.$emit('editItem', item);
      this.selected = [];
    },
  },
};
</script>

<style scoped>
  .add {
    margin: 0 3px;
  }
  .edit {
    margin: 0 8px;
  }
  .delete {
    margin: 0 7px;
  }
  .table-search {
    position: absolute;
    top: 3px;
    left: 170px;
  }
  .table-title {
    position: absolute;
    top: 15px;
    left: 50%;
  }
</style>
