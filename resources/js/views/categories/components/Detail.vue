<template>
  <q-card class="bg-dark text-orange">
    <q-card-section>
      <div v-for="(val, key, index) in currentItem" :key="index" class="text-h5">{{ $t('category.'+key) }} - {{ val }}</div>
    </q-card-section>
    <q-bar class="bar-bottom">
      <q-btn dense flat icon="close" @click="$emit('close')">
        <q-tooltip
          content-class="bg-amber text-black shadow-up-4"
          :offset="[5, 5]"
          content-style="box-shadow: 2px -2px 10px orange;"
        >{{ $t('general.close') }}</q-tooltip>
      </q-btn>
      <q-btn dense flat icon="save" @click="$emit('handleSubmit', currentItem)">
        <q-tooltip
          content-class="bg-amber text-black"
          :offset="[5, 5]"
          content-style="box-shadow: 2px -2px 10px orange;"
        >{{ $t('general.save') }}</q-tooltip>
      </q-btn>
    </q-bar>
  </q-card>
</template>

<script>
export default {
  name: 'ItemDetail',
  props: {
    currentItem: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.bar {
    height: 35px;
}
.bar-bottom {
    height: 35px;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: -1px -1px 9px orange;
}
</style>
