<template>
  <v-main class="bg-green-lighten-4">
    <v-response>
      <v-card color="transparent" min-height="100vh" max-height="100vh">
        <v-sheet
          class="ma-auto mt-12 bg-green-lighten-3"
          :elevation="3"
          width="25vw"
          height="50vh"
          rounded="lg"
        >
          <v-row>
            <v-col cols="12" md="6" offset-md="3">
              <p
                class="text-h4 text-green-darken-4 font-weight-bold text-center pt-2"
              >
                LOGIN
              </p>
            </v-col>
          </v-row>
          <v-card class="pa-12 ma-10" :elevation="0" color="transparent">
            <v-row>
              <v-text-field
                v-model="username"
                label="Usuário"
                color="white"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="password"
                label="Senha"
                color="white"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-btn class="ma-auto bg-green" @click="login">Entrar</v-btn>
            </v-row>
          </v-card>
        </v-sheet>
      </v-card>
    </v-response>
  </v-main>
</template>

<script>
import axios from "axios";
import Global from "../Global.js";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      await axios({
        ...Global.configAxios,
        method: "POST",
        url: `${Global.url}/login`,
        data: { username: this.username, password: this.password },
      })
        .then((res) => {
          localStorage.setItem("jwt", res.data.jwt);

          setTimeout(() => {
            this.$router.push(`${res.data.redirect}`);
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>