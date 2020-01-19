<template>
  <div class="q-mb-xl q-pb-md go">
    <q-table
      :title="tableTitle"
      :columns="columns"
      :pagination.sync="pagination"
      :data="data"
      selection="single"
      :selected.sync="selected"
      :filter="filter"
      :separator="separator"
      :visible-columns="visibleColumns"
      :grid="mode === 'grid'"
    >
      <template v-if="selected.length == 0" slot="top">
        <q-btn
          v-anime="{
            translateX: [-50, 0],
            duration: 900,
          }"
          dense
          icon="add_circle"
          size="14px"
          color="white"
          text-color="secondary"
          :label="$t('dynamicTable.add')"
          @click="$emit('addItem')"
        >
          <q-tooltip
            content-class="bg-amber text-black shadow-4"
            :offset="[5, 5]"
          >
            {{ $t('dynamicTable.addToolTip') }}
          </q-tooltip>
        </q-btn>
        <q-input
          v-model="filter"
          class="table-search"
          outlined
          dense
          debounce="300"
          :placeholder="$t('dynamicTable.search')"
        >
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
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          emit-value
          map-options
          option-value="name"
          :display-value="$t('dynamicTable.columns')"
          :options="columns"
          :color="color"
        />
        <q-select
          v-if="mode === 'list'"
          v-model="separator"
          borderless
          dense
          options-dense
          emit-value
          map-options
          hide-underline
          :display-value="$t('dynamicTable.borders')"
          :options="separatorOptions"
          :color="color"
        />
        <q-btn
          color="white"
          text-color="secondary"
          flat
          dense
          :icon="mode === 'list' ? 'grid_on' : 'view_list'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
        />
      </template>
      <template slot="top-selection">
        <div v-anime="{ translateX: [-50, 0], duration: 800 }">
          <q-btn
            class="edit"
            dense
            color="white"
            text-color="deep-orange"
            icon="edit"
            :disable="loading"
            @click="editItem"
          >
            <q-tooltip
              content-class="bg-amber text-black shadow-4"
              :offset="[5, 5]"
            >
              {{ $t('dynamicTable.editToolTip') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            class="delete"
            dense
            color="white"
            text-color="deep-orange"
            icon="delete"
            :disable="loading"
            @click="deleteItem"
          >
            <q-tooltip
              content-class="bg-amber text-black shadow-4"
              :offset="[5, 5]"
            >
              {{ $t('dynamicTable.deleteToolTip') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            class="delete"
            dense
            color="white"
            text-color="deep-orange"
            icon="remove_red_eye"
            :disable="loading"
            @click="showItem"
          >
            <q-tooltip
              content-class="bg-amber text-black shadow-4"
              :offset="[5, 5]"
            >
              {{ $t('dynamicTable.showToolTip') }}
            </q-tooltip>
          </q-btn>
        </div>
        <q-input
          v-model="filter"
          class="table-search"
          dense
          outlined
          debounce="300"
          :placeholder="$t('dynamicTable.search')"
        >
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
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          emit-value
          map-options
          option-value="name"
          display-value="Stunlar"
          :options="columns"
          :color="color"
        />
        <q-select
          v-if="mode === 'list'"
          v-model="separator"
          borderless
          dense
          options-dense
          emit-value
          map-options
          hide-underline
          display-value="Kenarlıklar"
          :options="separatorOptions"
          :color="color"
        />
        <q-btn
          color="white"
          text-color="deep-orange"
          flat
          dense
          :icon="mode === 'list' ? 'grid_on' : 'view_list'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
        />
      </template>
      <template v-if="mode === 'grid'" v-slot:item="props">
        <div
          class="q-pa-xs col-xs-6 col-sm-4 col-md-3 col-lg-3 grid-style-transition cursor-pointer"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
          style="transition: all ease 0.2s"
        >
          <q-card
            :class="
              `${
                props.selected
                  ? $q.dark.isActive
                    ? 'bg-grey-9'
                    : 'bg-grey-2'
                  : ''
              }`
            "
            @click.native="props.selected = !props.selected"
          >
            <template>
              <q-list>
                <q-checkbox
                  v-if="selectionCheckBox"
                  v-model="props.selected"
                  dense
                  :color="color"
                  :label="props.row.name"
                />
                <q-item v-for="(col, i) in props.cols" :key="i">
                  <q-item-section>
                    <q-item-label lines="1" caption>
                      {{ col.label }}
                    </q-item-label>
                    <q-item-label
                      :lines="
                        typeof col.value === 'string' &&
                          (col.value.includes(' ') || col.value.includes('-'))
                          ? 3
                          : 1
                      "
                    >
                      {{ col.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-popup-proxy v-if="props.selected == 1" context-menu>
                  <q-banner>
                    <q-btn
                      class="edit"
                      dense
                      color="white"
                      text-color="deep-orange"
                      icon="edit"
                      :disable="loading"
                      @click="editItem"
                    >
                      <q-tooltip
                        content-class="bg-amber text-black shadow-4"
                        :offset="[5, 5]"
                      >
                        {{ $t('dynamicTable.editToolTip') }}
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      class="delete"
                      dense
                      color="white"
                      text-color="deep-orange"
                      icon="delete"
                      :disable="loading"
                      @click="deleteItem"
                    >
                      <q-tooltip
                        content-class="bg-amber text-black shadow-4"
                        :offset="[5, 5]"
                      >
                        {{ $t('dynamicTable.deleteToolTip') }}
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      class="delete"
                      dense
                      color="white"
                      text-color="deep-orange"
                      icon="remove_red_eye"
                      :disable="loading"
                      @click="showItem"
                    >
                      <q-tooltip
                        content-class="bg-amber text-black shadow-4"
                        :offset="[5, 5]"
                      >
                        {{ $t('dynamicTable.showToolTip') }}
                      </q-tooltip>
                    </q-btn>
                  </q-banner>
                </q-popup-proxy>
              </q-list>
            </template>
          </q-card>
        </div>
      </template>
      <template v-if="mode === 'list'" v-slot:body="props">
        <q-tr
          v-anime="{ opacity: [0, 1], duration: 1200 }"
          :props="props"
          :class="'cursor-pointer'"
          @click.native="props.selected = !props.selected"
        >
          <q-popup-proxy v-if="props.selected == 1" context-menu>
            <q-banner>
              <q-btn
                class="edit"
                dense
                color="white"
                text-color="deep-orange"
                icon="edit"
                :disable="loading"
                @click="editItem"
              >
                <q-tooltip
                  content-class="bg-amber text-black shadow-4"
                  :offset="[5, 5]"
                >
                  {{ $t('dynamicTable.editToolTip') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                class="delete"
                dense
                color="white"
                text-color="deep-orange"
                icon="delete"
                :disable="loading"
                @click="deleteItem"
              >
                <q-tooltip
                  content-class="bg-amber text-black shadow-4"
                  :offset="[5, 5]"
                >
                  {{ $t('dynamicTable.deleteToolTip') }}
                </q-tooltip>
              </q-btn>
              <q-btn
                class="delete"
                dense
                color="white"
                text-color="deep-orange"
                icon="remove_red_eye"
                :disable="loading"
                @click="showItem"
              >
                <q-tooltip
                  content-class="bg-amber text-black shadow-4"
                  :offset="[5, 5]"
                >
                  {{ $t('dynamicTable.showToolTip') }}
                </q-tooltip>
              </q-btn>
            </q-banner>
          </q-popup-proxy>
          <q-td auto-width>
            <q-checkbox
              v-if="selectionCheckBox"
              v-model="props.selected"
              color="deep-orange"
            />
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
import { mapState } from 'vuex';
export default {
  name: 'DynamicTable',
  props: {
    tableTitle: {
      type: String,
      required: false,
      default: '',
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
      default: true,
    },
    topRightOptions: {
      type: Object,
      default: () => {
        return {
          visibleCols: true,
          cellLines: true,
          visibleColumns: [],
          fullscreenToggle: true,
        };
      },
    },
    gridCardStyle: {
      type: String,
      default: 'vertical',
      validator: value => ['horizontal', 'vertical'].indexOf(value) !== -1,
    },
  },
  data() {
    return {
      filter: '',
      selected: [],
      selectionCheckBox: false,
      separator: 'horizontal',
      visibleColumns: [],
      mode: 'list',
      color: 'orange',
      separatorOptions: [
        { label: this.$t('dynamicTable.horizontal'), value: 'horizontal' },
        { label: this.$t('dynamicTable.vertical'), value: 'vertical' },
        { label: this.$t('dynamicTable.cell'), value: 'cell' },
        { label: this.$t('dynamicTable.none'), value: 'none' },
      ],
      pagination: { rowsPerPage: 10, page: 1 },
    };
  },
  computed: {
    ...mapState({
      effects: state => state.settings.effects,
    }),
  },
  watch: {},
  mounted() {
    this.visibleColumns = this.columns.map(v => {
      if (v.hideonload) {
        return;
      }
      return v.name;
    });
  },
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
      this.filter = '';
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
  top: 13px;
  left: 170px;
}
.table-title {
  position: absolute;
  top: 15px;
  left: 50%;
}
</style>
