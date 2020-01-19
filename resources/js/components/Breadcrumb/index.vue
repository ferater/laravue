<template>
  <main>
    <!--   <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">
            {{ generateTitle(item.meta.title) }}
          </span>
          <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb> -->
    <div id="crouton">
      <ul>
        <transition-group name="breadcrumb">
          <li v-for="(item, index) in levelList" :key="item.path">
            <a v-if="item.redirect==='noredirect'||index==levelList.length-1" @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
            <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
          </li>
        </transition-group>
      </ul>
    </div>
  </main>
</template>

<script>
import { generateTitle } from '@/utils/i18n';
import pathToRegexp from 'path-to-regexp';

export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);

      const first = matched[0];
      if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched);
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    pathCompile(path) {
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    },
  },
};
</script>

<style scoped>
* {
    font-family: sans-serif;
}

#crouton ul {
    margin: 10px 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    list-style: none;
}

#crouton li {
    float: left;
    margin: 0 10px;
}

#crouton a {
    background: #ddd;
  padding: .3em 1em;
  float: left;
  text-decoration: none;
  color: #444;
  text-shadow: 0 1px 0 rgba(255,255,255,.5);
  position: relative;
}

#crouton li:first-child a {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

#crouton li:last-child a {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #42b983;
    color: #fff;
}

#crouton a:hover {
    background: #42b983;
    color: #fff;
}

#crouton li:not(:first-child) > a::before {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -1.5em;
    border-width: 1.5em 0 1.5em 1em;
    border-style: solid;
    border-color: #ddd #ddd #ddd transparent;
    left: -1em;
}
#crouton li:last-child > a::before {
   border-color: #42b983 #42b983 #42b983 transparent;
}

#crouton li:not(:first-child) > a:hover::before {
    border-color: #42b983 #42b983 #42b983 transparent;
}

#crouton li:not(:last-child) > a::after {
  content: "";
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
  border-top: 1.5em solid transparent;
  border-bottom: 1.5em solid transparent;
  border-left: 1em solid #ddd;
  right: -1em;
}

#crouton li:not(:last-child) > a:hover::after {
    border-left-color: #42b983;
}
</style>
