<template>
  <div class="detail">
    <div class="top" />
    <div class="detail-left">
      <div v-for="(val, key, index) in cloneItem" :key="index" class="row-item">
        <div class="key chip">{{ key }}</div>
      </div>
    </div>
    <div class="detail-right">
      <div v-for="(val, key, index) in cloneItem" :key="index" class="row-item">
        <div class="val">{{ val }}</div>
      </div>
    </div>
    <ul class="select">
      <li v-for="(val, key) in item" :key="key">
        <input
          :id="key"
          v-model="selectedKeys"
          type="checkbox"
          :value="key"
          @click="changeKeyArray(key, $event)"
        >
        <label :for="key">
          <span>{{ key }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DetailComponent',
  props: {
    item: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      cloneItem: {},
      selectedKeys: [],
      hiddenKeys: ['id', 'created_at', 'updated_at'],
    };
  },
  watch: {
    selectedKeys: function() {
      this.setCloneItem();
    },
  },
  created() {
    this.equalSelectedKeys();
  },
  methods: {
    equalSelectedKeys() {
      const a = Object.keys(this.item);
      const b = this.hiddenKeys;
      b.forEach(key => {
        a.splice(a.indexOf(key), 1);
      });
      this.selectedKeys = a;
    },
    changeKeyArray(key, event) {
      const a = this.hiddenKeys;
      if (event.target.checked) {
        a.splice(a.indexOf(key), 1);
      } else {
        a.push(key);
      }
    },
    setCloneItem() {
      const clone = Object.assign({}, this.item);
      const a = this.hiddenKeys;
      a.forEach(key => {
        delete clone[key];
      });
      this.cloneItem = clone;
    },
  },
};
</script>

<style scoped>
.detail {
  width: 90%;
  margin: 30px auto;
  position: relative;
  background-color: rgb(255, 255, 255);
  color: #000;
  padding: 5px 15px 10px 15px;
  border-radius: 5px;
  box-shadow: 1px 2px 8px rgba(209, 195, 195, 0.911),
    -1px -2px 2px rgba(209, 195, 195, 0.911), 1px 2px 8px orange;
}
.detail .top {
  position: relative;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 30px;
  background-color: rgba(231, 48, 94, 0.555);
  border-radius: 10px 10px 5px 5px;
}
.detail .detail-left {
  position: relative;
  width: 25%;
  min-width: 120px;
  top: -3px;
  left: -25px;
  border-radius: 15px 5px 5px 15px;
  padding: 20px 0 20px 20px;
  background-color: rgba(231, 48, 94, 0.555);
  float: left;
  box-shadow: 3px 1px 5px rgba(160, 105, 3, 0.945);
}
.detail .detail-left .row-item {
  padding-left: 10px;
}
.detail .detail-right {
  position: relative;
  left: -30px;
  width: 70%;
  margin: 0;
  padding: 20px 0 20px 0;
  display: inline-block;
}
.detail .detail-left .row-item,
.detail .detail-right .row-item {
  position: relative;
  width: 100%;
  height: 35px;
  bottom: 0;
}
.detail .detail-right .row-item {
  border-bottom: 1px dashed #cdcdcd;
}
.detail .detail-right .row-item {
  padding-left: 20px;
  margin-left: 8px;
}
.detail .detail-left .row-item .key,
.detail .detail-right .row-item .val {
  position: relative;
  bottom: -8px;
  width: 50%;
  display: inline-block;
}
.detail .detail-left .row-item .chip {
  background-color: #fff;
  width: 90%;
  padding: 2px 5px 2px 0;
  text-align: right;
  border-radius: 8px 0 0 8px;
  box-shadow: inset 2px 0 3px rgba(231, 48, 94, 0.555),
    inset 0 -1px 3px rgba(231, 48, 94, 0.555), 2px 2px 4px rgb(131, 104, 125);
  border-left: 2px solid rgba(231, 48, 94, 0.8);
  border-bottom: 1px solid rgba(231, 48, 94, 0.8);
  border-top: 1px solid rgba(231, 48, 94, 0.8);
  border-right: 2px solid rgba(231, 48, 94, 0.8);
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: bold;
}

.select {
  position: absolute;
  top: 10px;
  right: 0;
}
</style>
