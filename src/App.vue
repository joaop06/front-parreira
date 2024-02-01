<template>
  <v-app>
    <v-main>
      <Navbar v-if="$route.path != '/login'" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>
