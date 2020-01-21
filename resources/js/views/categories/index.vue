<template>
  <div class="app-container">
    <Skeleton
      v-if="loading"
      :columns="columns"
      class="skeleton"
    />
    <dynamic-table
      v-else
      :table-title="tableTitle"
      :columns="columns"
      :data="list"
      search
      @showItem="handleShow"
      @addItem="handleCreateForm"
      @editItem="handleEditForm"
      @deleteItem="handleDelete"
    />
    <q-dialog
      v-model="formVisible"
      position="left"
    >
      <Form
        :current-item="currentItem"
        :form-title="formTitle"
        @submit="handleSubmit"
        @close="close"
      />
    </q-dialog>
    <q-dialog
      v-model="detail"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <Detail
        :current-item="currentItem"
        @close="close"
      />
    </q-dialog>
  </div>
</template>

<script>
import DynamicTable from '@/components/DynamicTable';
import Skeleton from '@/components/DynamicTable/Skeleton';
import Form from './components/Form';
import Detail from './components/Detail';
import Resource from '@/api/resource';
const itemResource = new Resource('categories');
export default {
  name: 'CategoryList',
  components: {
    DynamicTable, Skeleton, Form, Detail,
  },
  data() {
    return {
      /** Tablo Verileri */
      name: this.$t('category.category'),
      tableTitle: this.$t('category.categories'),
      currentItem: {},
      list: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('category.name'),
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
        },
        { name: 'code', align: 'left', label: this.$t('category.code'), field: 'code', sortable: true },
        { name: 'description', align: 'left', label: this.$t('general.description'), field: 'description', sortable: true },
      ],
      /** /Tablo verileri **/
      /** ************************ **/
      /** Default item tanımları (formu boşaltmak için) **/
      /** ************************ **/
      editedItem: {
        name: '',
        code: '',
        description: '',
      },
      defaultItem: {
        name: '',
        code: '',
        description: '',
      },
      /** /Default item tanımları **/
      /** ************************ **/
      /** ***************** **/
      /** Tema Zımbırtıları **/
      color: 'orange',
      loading: true,
      /** /Tema Zımbırtıları **/
      /** *********************** **/
      /** Form, Dialog **/
      detail: false,
      formVisible: false,
      formTitle: '',
      /** /Form, Dialog verileri **/
      /** ************************ **/
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      const { data } = await itemResource.list({});
      this.list = data;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    handleShow(item) {
      this.detail = true;
      this.currentItem = Object.assign({}, item);
      console.log('handleShow item id:', item);
    },
    handleSubmit() {
      if (this.currentItem.id !== undefined) {
        itemResource.update(this.currentItem.id, this.currentItem).then(response => {
          this.$notify({
            dangerouslyUseHTMLString: true,
            title: this.$t('dynamicTable.success'),
            message: this.name + ' ' + '<span style="color: teal">' + this.currentItem.name + '</span>' + ' ' + this.$t('dynamicTable.successEditMessage'),
            type: 'success',
            position: 'bottom-left',
          });
          setTimeout(() => {
            this.getList();
          }, 700);
          this.currentItem = Object.assign({}, this.defaultItem);
        }).catch(error => {
          console.log(error);
        }).finally(() => {
          this.formVisible = false;
        });
      } else {
        itemResource
          .store(this.currentItem)
          .then(response => {
            this.$message({
              message: this.$t('dynamicTable.successCreateMessage', { item: this.currentItem.name }),
              type: 'success',
              duration: 5 * 1000,
            });
            this.currentItem = Object.assign({}, this.defaultItem);
            this.formVisible = false;
            this.getList();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleCreateForm() {
      this.formVisible = true;
      this.formTitle = this.$t('dynamicTable.new', { item: this.name });
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    handleDelete(id, name) {
      const h = this.$createElement;
      this.$confirm(null, {
        title: this.$t('general.attention'),
        message: h('p', null, [
          h('span', null, this.$t('general.this') + ' ' + this.$t('category.category') + ': '),
          h('i', { style: 'color: teal; font-weight: bold; text-decoration: underline;' }, name),
          h('span', null, ' ' + this.$t('general.willDelete')),
        ]),
        confirmButtonText: this.$t('general.delete'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.loading = true;
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = this.$t('general.deleting');
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 1000);
          } else {
            done();
          }
        },
      }).then(() => {
        itemResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: this.$t('general.deleteSuccess', { item: this.name }),
          });
          this.getList();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('general.deleteCanceled'),
        });
      });
    },
    handleEditForm(item) {
      this.formTitle = this.$t('dynamicTable.editFormTitle', { item: this.name });
      this.currentItem = Object.assign({}, item);
      this.formVisible = true;
    },
    close() {
      this.detail = false;
      this.formVisible = false;
      this.currentItem = Object.assign({}, this.defaultItem);
    },
  },
};
</script>

<style scoped>
.skeleton {
  animation-duration: 0.2s;
}
</style>
