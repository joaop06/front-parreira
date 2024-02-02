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
              label="E-mail"
              v-model="filters.email"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              clearable
              variant="outlined"
              color="green-darken-1"
              label="Usuário"
              v-model="filters.username"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              clearable
              variant="outlined"
              color="green-darken-1"
              label="Grupo"
              :items="listGroups.names"
              v-model="filters.group"
            ></v-select>
          </v-col>
          <v-col>
            <v-switch
              color="green-darken-1"
              label="Ativo"
              v-model="filters.active"
            ></v-switch>
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
          >USUÁRIOS</v-card
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
            <div v-if="allRegisters.rows.length > 0">
              <v-col v-for="(user, i) in allRegisters.rows" :key="user.id">
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
                          boxDialog(
                            { type: 'upload/delete', status: true },
                            user
                          )
                        "
                      >
                        <v-icon color="pink">mdi-pencil</v-icon>
                      </v-btn>

                      <v-icon
                        v-if="
                          nameAttr.field == 'active' &&
                          nameAttr.type == 'boolean'
                        "
                        :color="
                          formatDataRegister(
                            user,
                            user[nameAttr.field],
                            nameAttr
                          )
                            ? 'green'
                            : 'red'
                        "
                      >
                        {{
                          formatDataRegister(
                            user,
                            user[nameAttr.field],
                            nameAttr
                          )
                            ? "mdi-check-bold"
                            : "mdi-close-thick"
                        }}
                      </v-icon>

                      <p v-else>
                        {{
                          formatDataRegister(
                            user,
                            user[nameAttr.field],
                            nameAttr
                          )
                        }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </div>

            <v-row v-else>
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
            CADASTRO DE USUÁRIOS
          </v-card-text>

          <v-card-text
            v-if="showDialog.type == 'upload/delete'"
            class="text-center text-h6 text-green-darken-4 font-weight-bold"
          >
            ATUALIZAÇÃO DE USUÁRIOS
          </v-card-text>

          <v-row class="ma-2">
            <v-col cols="4">
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Nome"
                v-model="objectUsers.data.name"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Usuário"
                v-model="objectUsers.data.username"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Grupo"
                :items="listGroups.names"
                v-model="objectUsers.data.group_id"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="E-mail"
                v-model="objectUsers.data.email"
              ></v-text-field>
            </v-col>
            <v-col v-if="showDialog.type == 'upload/delete'">
              <v-switch
                color="green-darken-1"
                label="Ativo"
                v-model="objectUsers.data.active"
              ></v-switch>
            </v-col>

            <v-col v-if="showDialog.type == 'create'">
              <v-text-field
                clearable
                variant="outlined"
                color="green-darken-1"
                label="Senha"
                v-model="objectUsers.data.password"
              ></v-text-field>
            </v-col>
          </v-row>

          <p
            class="text-subtitle ma-auto pa-5 text-blue"
            v-if="objectUsers.message !== '' && !objectUsers.error"
          >
            {{ objectUsers.message }}
          </p>
          <p class="text-subtitle ma-auto pa-5 text-red" v-else>
            {{ objectUsers.message }}
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

            <v-col v-if="showDialog.type == 'upload/delete'">
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

      allRegisters: { rows: [] },
      allAttrs: [{ field: "action", label: "ação" }],

      filters: {
        name: "",
        email: "",
        username: "",
        group: "",
        active: "",
      },

      showDialog: {
        status: false,
        type: "",
      },

      listGroups: {
        names: [],
        groups: [],
      },

      objectUsers: {
        error: false,
        message: "",
        data: {
          name: "",
          email: "",
          username: "",
          group_id: "",
          active: "",
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
          url: `${Global.url}/users?page=${
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
        if (e?.response?.status == 401) {
          // Mensagem: e.response.data.error
          this.$router.push(`${e.response.data.redirect}`);
        }
      }
    },

    async create() {
      const group_id = this.listGroups.groups.find(
        (group) => group.name === this.objectUsers.data.group_id
      );
      console.log(group_id);
      this.objectUsers.data.group_id = group_id.id;
      await axios({
        ...this.configAxios,
        url: `${Global.url}/users`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
        data: { ...this.objectUsers.data, active: true },
      })
        .then(async (res) => {
          this.objectUsers.message = "Usuário cadastrado com sucesso!";

          setTimeout(async () => {
            this.showDialog.status = false;
            this.objectUsers.error = false;
            this.objectUsers.message = "";
            await this.findAndCountAll();
          }, 1000);
        })
        .catch((err) => {
          if (err?.response?.status == 401) {
            // Mensagem: e.response.data.error
            this.$router.push(`${err.response.data.redirect}`);
          }
          console.log(err);
          this.objectUsers.error = true;
          this.objectUsers.message = err.response.data.error || err.message;
        });
    },

    async destroy() {
      try {
        await axios({
          ...this.configAxios,
          url: `${Global.url}/users?id=${this.objectUsers.data.id}`,
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        }).then(async (res) => {
          this.objectUsers.message = "Usuário deletado com sucesso!";

          setTimeout(async () => {
            this.showDialog.status = false;
            this.objectUsers.error = false;
            this.objectUsers.message = "";
            await this.findAndCountAll();
          }, 1000);
        });
      } catch (e) {
        if (e?.response?.status == 401) {
          // Mensagem: e.response.data.error
          this.$router.push(`${e.response.data.redirect}`);
        }

        this.objectUsers.error = true;
        this.objectUsers.message = err.message || err.data.message;
      }
    },

    async update() {
      const group_id = this.listGroups.groups.find(
        (group) => group.name === this.objectUsers.data.group_id
      );
      this.objectUsers.data.group_id = group_id.id;
      await axios({
        ...this.configAxios,
        url: `${Global.url}/users`,
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
        data: this.objectUsers.data,
      })
        .then((res) => {
          if (res.status == 201) {
            this.objectUsers.message = "Usuário atualizado com sucesso!";
          }

          setTimeout(async () => {
            this.showDialog.status = false;
            this.objectUsers.error = false;
            this.objectUsers.message = "";
            await this.findAndCountAll();
          }, 1000);
        })
        .catch((err) => {
          if (e?.response?.status == 401) {
            // Mensagem: e.response.data.error
            this.$router.push(`${e.response.data.redirect}`);
          }

          this.objectUsers.error = true;
          this.objectUsers.message = err.message || err.data.message;
        });
    },

    async mountQuery() {
      let query = "";

      if (!["", null, undefined].includes(this.filters.name)) {
        query += `&name=%25${this.filters.name}%25`;
      }
      if (!["", null, undefined].includes(this.filters.email)) {
        query += `&email=${this.filters.email}`;
      }
      if (!["", null, undefined].includes(this.filters.username)) {
        query += `&username=${this.filters.username}`;
      }
      if (!["", null, undefined].includes(this.filters.group)) {
        const group_id = this.listGroups.groups.find(
          (group) => group.name === this.filters.group
        );
        query += `&group_id=${group_id.id}`;
      }
      if (!["", null, undefined].includes(this.filters.active)) {
        query += `&active=${this.filters.active}`;
      }

      return query;
    },

    async getAttrsModel() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/users/table-attributes`,
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }).then((res) => {
        res.data.forEach((attr) => {
          this.allAttrs.push(attr);
        });
      });
    },

    async clearFilters() {
      this.filters.name = "";
      this.filters.email = "";
      this.filters.username = "";
      this.filters.group_id = "";
      this.filters.active = "";
      this.pagination.page = 1;
      await this.findAndCountAll();
    },

    async boxDialog(mode, user) {
      this.showDialog = {
        status: mode.status,
        type: mode.type,
      };
      this.objectUsers.error = false;
      this.objectUsers.message = "";

      if (mode.type == "create") {
        this.objectUsers.data = {
          name: "",
          email: "",
          username: "",
        };
      } else if (mode.type == "upload/delete") {
        this.objectUsers.data = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          group_id: this.listGroups.groups.find(
            (group) => group.id === user.group_id
          ).name,
          active: user.active,
        };
      }
    },

    async getGroups() {
      await axios({
        ...this.configAxios,
        url: `${Global.url}/group`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      }).then(async (res) => {
        res.data.rows.forEach((group) => {
          this.listGroups.names.push(group.name);
          this.listGroups.groups.push(group);
        });

        console.log(this.listGroups);
      });
    },

    formatDataRegister(user, data, attr) {
      if (attr.field.includes("_id")) {
        let nameRelation = attr.field
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

        data = user[nameRelation[0]].name;
        attr.type = typeof data;
      }

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
    await this.getAttrsModel();
    await this.getGroups();
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