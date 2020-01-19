<template>
  <q-markup-table>
    <thead>
      <tr>
        <th v-for="(column, index) in columns" :key="index" class="text-left" style="width: 33%">
          <q-skeleton type="rect" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="n in 10" :key="n">
        <td v-for="(column, index) in columns" :key="index" class="text-left">
          <q-skeleton type="rect" width="33%" />
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td v-for="(column, index) in columns" :key="index" style="width: 33%">
          <q-skeleton type="rect" />
        </td>
      </tr>
    </tfoot>
  </q-markup-table>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    columns: {
      type: [Array, Object],
      required: true,
    },
  },
};
</script>
