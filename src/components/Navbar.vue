<template>
  <v-card
    class="bg-green-lighten-5"
    width="100vw"
    height="5vh"
    color="transparent"
    :elevation="10"
  >
    <v-row>
      <v-col class="ma-auto" cols="auto">
        <v-btn
          class="ma-auto"
          color="transparent"
          :elevation="0"
          icon="mdi-home-circle"
          to="/"
        ></v-btn>
      </v-col>

      <v-col class="ma-auto" cols="auto">
        <v-btn
          class="text-subtitle-1 text-green-darken-4 font-weight-bold"
          color="transparent"
          :elevation="0"
          to="/clientes"
        >
          CLIENTES
        </v-btn>
      </v-col>

      <v-col class="ma-auto" cols="auto">
        <v-btn
          class="text-subtitle-1 text-green-darken-4 font-weight-bold"
          color="transparent"
          :elevation="0"
          to="/ordem-servico"
        >
          ORDEM DE SERVIÇO
        </v-btn>
      </v-col>

      <v-col class="ma-auto" cols="auto">
        <v-btn
          class="text-subtitle-1 text-green-darken-4 font-weight-bold"
          color="transparent"
          :elevation="0"
          to="/usuarios"
        >
          USUARIOS
        </v-btn>
      </v-col>

      <v-col class="ma-auto" cols="auto">
        <v-btn
          class="ma-auto"
          color="transparent"
          :elevation="0"
          icon="mdi-exit-to-app"
          @click="logout"
        ></v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import Global from "../Global.js";

export default {
  data() {
    return {
      configAxios: Global.configAxios,
    };
  },
  methods: {
    async logout() {
      try {
        await axios({ ...this.configAxios, url: `${Global.url}/logout` }).then(
          (res) => {
            this.$router.push(`${res.data.redirect}`);
          }
        );
      } catch (e) {
        this.$router.push(`/login`);
      }
      localStorage.removeItem("jwt");
    },
  },
};
</script>