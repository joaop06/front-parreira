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
              v-model="filters.name"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              clearable
              variant="outlined"
              color="green-darken-1"
              label="Documento"
              v-model="filters.document"
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
          class="ma-auto mt-2 text-green-darken-4 text-subtitle-1 font-weight-black pa-2"
          width="95vw"
          :elevation="2"
          rounded="tl-xl"
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
        <v-row class="fixed-row bg-white mb-5">
          <v-col
            v-for="(nameAttr, i) in allAttrs"
            :key="i"
            class="ma-auto d-flex"
          >
            <v-card class="ma-auto" :elevation="0" color="transparent">
              <p class="ma-auto text-body-2 font-weight-black">
                {{ nameAttr.label.toUpperCase() }}
              </p>
            </v-card>
          </v-col>
        </v-row>

        <v-response>
          <v-row class="d-block justify-center">
            <div v-if="[allRegisters.rows].length > 0">
              <v-col v-for="(client, i) in allRegisters.rows" :key="client.id">
                <v-card
                  :class="`${
                    i % 2 == 0 ? 'bg-blue-grey-lighten-5' : 'bg-white'
                  } ${'ma-n2'}`"
                >
                  <v-row>
                    <v-col
                      v-for="(nameAttr, i) in allAttrs"
                      :key="i"
                      class="ma-auto text-body-2"
                      align="center"
                    >
                      <v-btn
                        v-if="nameAttr.field == 'action'"
                        height="47px"
                        icon
                        variant="plain"
                        size="small"
                        :elevation="0"
                        @click="
                          boxDialog({ type: 'upload', status: true }, client)
                        "
                      >
                        <v-icon color="pink">mdi-pencil</v-icon>
                      </v-btn>

                      <p v-else>
                        {{
                          formatDataRegister(client[nameAttr.field], nameAttr)
                        }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </div>

            <v-row v-if="[allRegisters.rows].length === 0">
              <v-col>
                <v-card
                  class="ma-auto mt-8"
                  width="25vw"
                  color="transparent"
                  :elevation="0"
                >
                  <p class="text-h6 text-center font-weight-bold">
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
          class="ma-auto mt-1 text-green-darken-4 text-body-2 font-weight-black pa-1 d-flex"
          width="95vw"
          :elevation="2"
          rounded="lg"
          height="6vh"
        >
          <v-col class="ma-auto text-start">
            <p>TOTAL: {{ allRegisters.totalCount }}</p>
          </v-col>

          <v-col class="mt-n4 d-flex justify-end">
            <v-sheet width="10vw" class="text-center">
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
            v-if="showDialog.type == 'create'"
            class="text-center text-h6 text-green-darken-4 font-weight-bold"
          >
            CADASTRO DE CLIENTES
          </v-card-text>

          <v-card-text
            v-if="showDialog.type == 'upload'"
            class="text-center text-h6 text-green-darken-4 font-weight-bold"
          >
            ATUALIZAÇÃO DE CLIENTES
          </v-card-text>

          <v-row class="ma-2">
            <v-col>
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Nome"
                v-model="objectClient.data.name"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Documento"
                v-model="objectClient.data.document"
              ></v-text-field>
            </v-col>
          </v-row>

          <p
            class="text-subtitle ma-auto pa-5 text-blue"
            v-if="objectClient.message !== '' && !objectClient.error"
          >
            {{ objectClient.message }}
          </p>
          <p class="text-subtitle ma-auto pa-5 text-red" v-else>
            {{ objectClient.message }}
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
                @click="update()"
                >ATUALIZAR</v-btn
              >

              <v-btn
                class="ma-1 ml-10 bg-red-darken-1"
                :elevation="0"
                rounded="lg"
                @click="destroy()"
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
import moment from "moment";

export default {
  data() {
    return {
      configAxios: Global.configAxios,

      allRegisters: {},
      allAttrs: [{ field: "action", label: "ação" }],

      filters: {
        name: "",
        document: "",
      },

      showDialog: {
        status: false,
        type: "",
      },

      objectClient: {
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
    async findAndCountAll() {
      try {
        const query = await this.mountQuery();

        this.allRegisters = await axios({
          ...this.configAxios,
          url: `${Global.url}/client?page=${
            this.allRegisters.totalCount <= this.pagination.perPage
              ? 1
              : this.pagination.page
          }&perPage=${
            this.pagination.perPage
          }&sort_type[]=desc&sort_field[]=createdAt${query}`,
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        }).then((res) => res.data);
      } catch (e) {
        console.log(e);
        if (e?.response?.status == 401) {
          // Mensagem: e.response.data.error
          this.$router.push(`${e.response.data.redirect}`);
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
        data: this.objectClient.data,
      })
        .then(async (res) => {
          this.objectClient.message = "Cliente cadastrado com sucesso!";

          setTimeout(async () => {
            this.showDialog.status = false;
            this.objectClient.error = false;
            this.objectClient.message = "";
            await this.findAndCountAll();
          }, 1000);
        })
        .catch((err) => {
          this.objectClient.error = true;
          this.objectClient.message = err.message || err.data.message;
        });
    },

    async destroy() {
      return;
    },

    async update() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/client`,
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
        data: this.objectClient.data,
      })
        .then((res) => {
          if (res.status == 200) {
            this.objectClient.message = "Cliente atualizado com sucesso!";
          }

          setTimeout(async () => {
            this.showDialog.status = false;
            this.objectClient.error = false;
            this.objectClient.message = "";
            await this.findAndCountAll();
          }, 1000);
        })
        .catch((err) => {
          this.objectClient.error = true;
          this.objectClient.message = err.response.data.error || err.message;
        });
    },

    async mountQuery() {
      let query = "";

      if (!["", null, undefined].includes(this.filters.name)) {
        query += `&name=%25${this.filters.name}%25`;
      }
      if (!["", null, undefined].includes(this.filters.document)) {
        query += `&document=${this.filters.document}`;
      }

      return query;
    },

    async getAttrsModel() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/client/table-attributes`,
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }).then((res) => {
        res.data.forEach((attr) => {
          this.allAttrs.push(attr);
        });
      });
    },

    async getAttrsModel() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/client/table-attributes`,
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }).then((res) => {
        res.data.forEach((attr) => {
          this.allAttrs.push(attr);
        });
      });

      console.log(this.allAttrs);
    },

    async clearFilters() {
      this.filters.name = "";
      this.filters.document = "";
      this.pagination.page = 1;
      await this.findAndCountAll();
    },
    boxDialog(mode, client) {
      this.showDialog = {
        status: mode.status,
        type: mode.type,
      };
      this.objectClient.error = false;
      this.objectClient.message = "";

      if (mode.type == "create") {
        this.objectClient.data = {
          name: "",
          document: "",
        };
      } else if (mode.type == "upload") {
        this.objectClient.data = {
          id: client.id,
          name: client.name,
          document: client.document,
        };
      }
    },
    formatDataRegister(data, attr) {
      if (attr.type === "datatime") {
        return moment(data).format("DD/MM/YYYY");
      } else if (attr.type === "string") {
        return data.toUpperCase();
      } else if (attr.type === "number") {
        return Number(data);
      } else if (attr.type === "boolean") {
        return !!data;
      } else {
        return data;
      }
    },
  },

  async mounted() {
    await this.findAndCountAll();
    await this.getAttrsModel();
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
