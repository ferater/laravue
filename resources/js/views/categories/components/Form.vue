<template>
  <q-card style="width: 600px">
    <q-card-section>
      <div class="text-h6">{{ formTitle }}</div>
    </q-card-section>
    <q-separator />
    <q-form
      @submit="$emit('submit')"
    >
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-input
          v-model="currentItem.name"
          dense
          outlined
          :color="color"
          :label-color="color"
          :label="$t('category.name')"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('form.required')]"
        >
          <template slot="append">
            <q-icon name="description" :color="color" />
          </template>
        </q-input>
        <q-input
          v-model="currentItem.description"
          dense
          outlined
          autogrow
          :color="color"
          :label-color="color"
          :label="$t('category.description')"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('form.required')]"
        >
          <template slot="append">
            <q-icon name="description" :color="color" />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn dense label="İptal" color="white" text-color="black" @click="$emit('close')" />
        <q-btn dense label="Kaydet" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
export default {
  name: 'Form',
  props: {
    currentItem: {
      type: Object,
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      color: 'orange',
    };
  },
};
</script>
