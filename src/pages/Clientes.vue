<template>
  <v-main class="mt-4">
    <v-response>
      <v-card class="pl-12 pr-12 pb-5 pt-2" :elevation="0">
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

        <v-row class="ma-auto" width="100vw">
          <v-btn-toggle v-model="toggle" divided>
            <v-btn
              class="ma-2 bg-green-darken-1"
              :elevation="0"
              rounded="lg"
              @click="boxDialog({ type: 'create', status: true })"
              >CRIAR</v-btn
            >
            <v-btn
              class="ma-2 bg-light-blue-lighten-3"
              :elevation="0"
              rounded="lg"
              @click="findAndCountAll()"
            >
              BUSCAR
            </v-btn>

            <v-btn
              class="ma-2 bg-red-darken-1"
              :elevation="0"
              rounded="lg"
              @click="clearFilters()"
            >
              LIMPAR FILTROS
            </v-btn>
          </v-btn-toggle>
        </v-row>
      </v-card>

      <v-row class="ma-auto fixed-row">
        <v-card
          class="ma-auto mt-2 text-green-darken-4 text-h6 font-weight-black pa-2"
          width="95vw"
          :elevation="2"
          rounded="lg"
          >CLIENTES</v-card
        >
      </v-row>

      <v-card
        class="ma-auto overflow-y-auto"
        color="transparent"
        :elevation="3"
        width="95vw"
        height="65vh"
      >
        <v-row class="fixed-row bg-white mb-4">
          <v-col
            v-for="(nameAttr, i) in gridOrdenation"
            :key="i"
            class="ma-auto d-flex"
          >
            <v-card class="ma-auto" :elevation="0" color="transparent">
              <p class="ma-auto text-body-2 font-weight-black">
                {{ nameAttr.toUpperCase() }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-response>
          <v-row class="d-block">
            <div v-if="[allRegisters.rows].length > 0">
              <v-col v-for="(client, i) in allRegisters.rows" :key="client.id">
                <v-card
                  :class="`${
                    i % 2 == 0 ? 'bg-white' : 'bg-blue-grey-lighten-5'
                  }${' ma-n2'}`"
                >
                  <v-row>
                    <v-col
                      v-for="(nameAttr, i) in gridOrdenation"
                      :key="i"
                      class="ma-auto text-body-2"
                      align="center"
                    >
                      <v-btn
                        v-if="nameAttr == 'action'"
                        icon="mdi-pencil text-pink"
                        color="transparent"
                        :elevation="0"
                        @click="
                          boxDialog({ type: 'upload', status: true }, client)
                        "
                      ></v-btn>

                      <p v-else>{{ client[nameAttr] }}</p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </div>

            <v-row v-else>
              <v-col>
                <v-card
                  class="ma-auto bg-green-lighten-1"
                  width="25vw"
                  color="transparent"
                  :elevation="2"
                >
                  <p
                    class="text-h5 text-center font-weight-black text-green-darken-4"
                  >
                    Nenhum registro encontrado
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-row>
        </v-response>
      </v-card>

      <v-row>
        <v-card
          class="ma-auto mt-1 text-green-darken-4 text-subtitle-1 font-weight-black pa-1 d-flex"
          width="95vw"
          :elevation="2"
          rounded="lg"
          height="7vh"
        >
          <v-col class="ma-auto text-start">
            <p>TOTAL: {{ allRegisters.totalCount }}</p>
          </v-col>

          <v-col class="mt-n3 d-flex justify-end">
            <v-sheet width="6vw" class="text-center">
              <v-select
                v-model="pagination.perPage"
                label="Linhas por página:"
                dense
                :items="[10, 20, 30]"
              ></v-select>
            </v-sheet>
            <v-pagination
              v-model="pagination.page"
              :length="
                allRegisters.totalCount <= pagination.perPage
                  ? 1
                  : parseInt(allRegisters.totalCount / pagination.perPage) + 1
              "
              :total-visible="5"
            ></v-pagination>
          </v-col>
        </v-card>
      </v-row>

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
                v-model="createClient.data.name"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Documento"
                v-model="createClient.data.document"
              ></v-text-field>
            </v-col>
          </v-row>

          <p
            class="text-subtitle ma-auto pa-5 text-blue"
            v-if="createClient.message !== '' && !createClient.error"
          >
            {{ createClient.message }}
          </p>
          <p class="text-subtitle ma-auto pa-5 text-red" v-else>
            {{ createClient.message }}
          </p>

          <v-row class="ma-auto pb-10">
            <v-btn
              v-if="showDialog.type == 'create'"
              class="ma-1 bg-green-darken-1"
              :elevation="0"
              rounded="lg"
              @click="create()"
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
import Global from "../Global.js";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      configAxios: Global.configAxios,

      allRegisters: {},
      allAttrs: [],
      gridOrdenation: [
        "action",
        "id",
        "name",
        "document",
        "createdAt",
        "updatedAt",
      ],

      filters: {
        name: "",
        document: "",
      },

      showDialog: {
        status: false,
        type: "",
      },

      createClient: {
        error: false,
        message: "",
        data: {
          name: "",
          document: "",
        },
      },

      pagination: {
        page: 1,
        perPage: 10,
      },
    };
  },
  methods: {
    ...mapMutations([
      "setSelected",
      "clearSelected",
      "setOptions",
      "setPage",
      "setItemsPerPage",
    ]),

    async findAndCountAll() {
      try {
        this.allRegisters = await axios({
          ...this.configAxios,
          url: `${Global.url}/client?page=${
            this.allRegisters.totalCount <= this.pagination.perPage
              ? 1
              : this.pagination.page
          }&perPage=${this.pagination.perPage}`,
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        }).then((res) => {
          console.log(res.data);

          const attrs = Object.keys(res.data?.rows[0]).filter(
            (attr) => attr != "deletedAt"
          );
          // this.allAttrs = attrs.splice(0, 0, "action");
          this.allAttrs = ["action", ...attrs];

          res.data?.rows.forEach((client) => {
            client.btn_action = "btn_action";
          });

          return res.data || {};
        });
      } catch (e) {
        if (e.status == 401) {
          this.$router.push(`${e.data.redirect}`);
        }
      }
    },

    async create() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/client`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
        data: this.createClient.data,
      })
        .then((res) => {
          this.createClient.message = "Cliente cadastrado com sucesso!";
        })
        .catch((err) => {
          this.createClient.error = true;
          this.createClient.message = err.message || err.data.message;
        });

      setTimeout(() => {
        this.showDialog.status = false;
        this.createClient.error = false;
        this.createClient.message = "";
      }, 1000);
    },

    async update() {
      await axios
        .put(`${Global.api_back}/client`, this.createClient.data)
        .then((res) => {
          if (res.status == 201) {
            this.createClient.message = "Cliente atualizado com sucesso!";
          } else {
            this.createClient.message = "Erro ao atualizar cliente";
          }
        })
        .catch((err) => {
          this.createClient.error = true;
          this.createClient.message = err.message || err.data.message;
        });

      setTimeout(() => {
        this.showDialog.status = false;
        this.createClient.error = false;
        this.createClient.message = "";
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

      this.allRegisters = await axios({
        ...this.configAxios,
        url: `${Global.url}/client${query ? query : ""}`,
      }).then((res) => {
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
      this.createClient.error = false;
      this.createClient.message = "";

      if (mode.type == "create") {
        this.createClient.data = {
          name: "",
          document: "",
        };
      } else if (mode.type == "upload") {
        this.createClient.data = {
          name: client.name,
          document: client.document,
        };
      }
    },
  },

  async mounted() {
    await this.findAndCountAll();
  },
};
</script>
  
<style scoped>
.fixed-row {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
