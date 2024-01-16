<template>
  <v-main class="bg-green-lighten-3" height="100%">
    <v-response>
      <v-card class="pa-12" color="green-lighten-4">
        <v-row>
          <v-col cols="4">
            <p class="text-h4 font-weight-black text-green-darken-4">
              CLIENTES
            </p>
          </v-col>

          <v-col cols="8">
            <v-row>
              <v-col>
                <v-text-field
                  clearable
                  variant="outlined"
                  color="green-darken-1"
                  label="Nome"
                  v-model="filterName"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  clearable
                  variant="outlined"
                  color="green-darken-1"
                  label="Documento"
                  v-model="filterDocument"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-btn-toggle v-model="toggle" divided>
                <v-btn
                  class="ma-1 bg-green-darken-1"
                  :elevation="0"
                  rounded="lg"
                  @click="boxDialog({ type: 'register', status: true })"
                  >CRIAR</v-btn
                >
                <v-btn
                  class="ma-1 bg-light-blue-lighten-3"
                  :elevation="0"
                  rounded="lg"
                  @click="findClient()"
                >
                  BUSCAR
                </v-btn>

                <v-btn
                  class="ma-1 bg-red-darken-1"
                  :elevation="0"
                  rounded="lg"
                  @click="clearFilters()"
                >
                  LIMPAR FILTROS
                </v-btn>
              </v-btn-toggle>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-container>
        <v-row>
          <v-col v-for="client in clients" :key="client.id">
            <v-card
              class="mt-2 ma-auto bg-green space-between"
              width="25vw"
              height="8vh"
            >
              <v-row>
                <v-col cols="2">
                  <v-btn
                    icon="mdi-pencil text-pink"
                    color="transparent"
                    :elevation="0"
                    @click="boxDialog({ type: 'upload', status: true }, client)"
                  ></v-btn>
                </v-col>
                <v-col cols="10">
                  <v-card-title
                    ><p class="font-weight-bold">
                      {{ client.name }}
                    </p></v-card-title
                  >
                  <v-card-subtitle>
                    Documento: {{ client.document }}
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="showDialog.status" max-width="60vw">
        <v-card rounded="xl">
          <v-card-actions>
            <v-btn
              color="red"
              icon="mdi-close"
              @click="boxDialog({ status: false })"
            ></v-btn>
          </v-card-actions>
          <v-card-text
            class="text-center text-h6 text-green-darken-4 font-weight-bold"
          >
            CADASTRO DE CLIENTES
          </v-card-text>

          <v-row class="ma-2">
            <v-col>
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Nome"
                v-model="registerClient.data.name"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Documento"
                v-model="registerClient.data.document"
              ></v-text-field>
            </v-col>
          </v-row>

          <p
            class="text-subtitle ma-auto pa-5 text-blue"
            v-if="registerClient.message !== '' && !registerClient.error"
          >
            {{ registerClient.message }}
          </p>
          <p class="text-subtitle ma-auto pa-5 text-red" v-else>
            {{ registerClient.message }}
          </p>

          <v-row class="ma-auto pb-10">
            <v-btn
              v-if="showDialog.type == 'register'"
              class="ma-1 bg-green-darken-1"
              :elevation="0"
              rounded="lg"
              @click="postClient()"
              >CADASTRAR</v-btn
            >

            <v-col v-if="showDialog.type == 'upload'">
              <v-btn
                class="ma-1 bg-green-darken-1"
                :elevation="0"
                rounded="lg"
                @click="putClient()"
                >ATUALIZAR</v-btn
              >

              <v-btn
                class="ma-1 ml-10 bg-red-darken-1"
                :elevation="0"
                rounded="lg"
                @click="deletClient()"
                >DELETAR</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-response>
  </v-main>
</template>
  
<script>
import axios from "axios";

export default {
  data() {
    return {
      clients: [],
      filterName: "",
      filterDocument: "",
      showDialog: {
        status: false,
        type: "",
      },

      registerClient: {
        error: false,
        message: "",
        data: {
          name: "",
          document: "",
        },
      },
    };
  },
  methods: {
    async getAllClients() {
      this.clients = await axios
        .get(`http://189.90.130.152:3001/client`)
        .then((res) => {
          console.log(res.data);
          return res.data.rows;
        });
    },
    async postClient() {
      await axios
        .post(`http://189.90.130.152:3001/client`, this.registerClient.data)
        .then((res) => {
          if (res.status == 201) {
            this.registerClient.message = "Cliente cadastrado com sucesso!";
          } else {
            this.registerClient.message = "Erro ao cadastrar cliente";
          }
        })
        .catch((err) => {
          this.registerClient.error = true;
          this.registerClient.message = err.message || err.data.message;
        });

      setTimeout(() => {
        this.showDialog.status = false;
        this.registerClient.error = false;
        this.registerClient.message = "";
      }, 1500);
    },
    async putClient() {
      await axios
        .put(`http://189.90.130.152:3001/client`, this.registerClient.data)
        .then((res) => {
          if (res.status == 201) {
            this.registerClient.message = "Cliente atualizado com sucesso!";
          } else {
            this.registerClient.message = "Erro ao atualizar cliente";
          }
        })
        .catch((err) => {
          this.registerClient.error = true;
          this.registerClient.message = err.message || err.data.message;
        });

      setTimeout(() => {
        this.showDialog.status = false;
        this.registerClient.error = false;
        this.registerClient.message = "";
      }, 1500);
    },
    async findClient() {
      let query;
      if (this.filterName !== "")
        query = !query
          ? `?name=${this.filterName}`
          : `${query}&name=${this.filterName}`;
      if (this.filterDocument !== "")
        query = !query
          ? `?document=${this.filterDocument}`
          : `${query}&document=${this.filterDocument}`;

      this.clients = await axios
        .get(`http://189.90.130.152:3001/client${query ? query : ""}`)
        .then((res) => {
          console.log(res.data);
          return res.data.rows;
        });
    },
    async clearFilters() {
      await this.getAllClients();
      this.filterName = "";
      this.filterDocument = "";
    },
    boxDialog(mode, client) {
      this.showDialog = {
        status: mode.status,
        type: mode.type,
      };
      this.registerClient.error = false;
      this.registerClient.message = "";

      if (mode.type == "register") {
        this.registerClient.data = {
          name: "",
          document: "",
        };
      } else if (mode.type == "upload") {
        this.registerClient.data = {
          name: client.name,
          document: client.document,
        };
      }
    },
  },
  async mounted() {
    await this.getAllClients();
  },
};
</script>
  
  