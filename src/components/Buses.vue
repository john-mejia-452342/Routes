<template>
  <div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card class="modal-content">
        <q-card-section class="row items-center q-pb-none" style="color: black;">
          <div class="text-h6">{{ text }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-input v-model="placa" label="Placa" style="width: 300px;" v-if="cambio == 0" />
          <q-input v-model="numero_bus" label="Número de Bus" style="width: 300px;" v-if="cambio == 0" />
          <q-input v-model="cantidad_asientos" label="Cantidad de Asientos" style="width: 300px;" />
          <q-input v-model="empresa_asignada" label="Empresa Asignada" style="width: 300px;" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar 💾" color="primary" @click="editarAgregarBus()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
      <h1>Buses</h1>
      <div class="btn-agregar">
        <q-btn color="secondary" label="Agregar" @click="agregarBus()" />
      </div>
      <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-botones="props">
          <q-td :props="props" class="botones">
            <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
            <q-btn color="amber" glossy label="❌" @click="InactivarBus(props.row._id)" v-if="props.row.estado == 1" />
            <q-btn color="amber" glossy label="✅" @click="ActivarBus(props.row._id)" v-else />
          </q-td>
        </template>
      </q-table>
      <div class="volver">
        <q-btn color="black"><router-link to="/">Volver</router-link></q-btn>

      </div>

    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

let buses = ref([]);
let rows = ref([]);
let fixed = ref(false)
let text = ref('')
let placa = ref('');
let numero_bus = ref();
let cantidad_asientos = ref('');
let empresa_asignada = ref('');
let cambio = ref(0)

async function obtenerInfo() {
  try {
    const responseBuses = await axios.get('bus/buses');
    buses.value = responseBuses.data.buses;
    rows.value = responseBuses.data.buses;
  } catch (error) {
    console.error('Error al obtener la información de los buses:', error);
  }
}

const columns = [
  { name: 'placa', label: 'Placa', field: 'placa', sortable: true },
  { name: 'numero_bus', label: 'Número de Bus', field: 'numero_bus', sortable: true },
  { name: 'cantidad_asientos', label: 'Cantidad de Asientos', field: 'cantidad_asientos' },
  { name: 'empresa_asignada', label: 'Empresa Asignada', field: 'empresa_asignada' },
  { name: 'estado', label: 'Estado', field: 'estado', sortable: true, format: (val) => (val ? 'Activo' : 'Inactivo') },
  {
    name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  {
    name: 'botones', label: 'Opciones',
    field: row => null,
    "sortable": false,
  },
];

function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  cambio.value = 0
}

async function editarAgregarBus() {
  if (cambio.value === 0) {
    const data = {
      placa: placa.value,
      numero_bus: numero_bus.value,
      cantidad_asientos: cantidad_asientos.value,
      empresa_asignada: empresa_asignada.value,
    };

    try {
      let res = await axios.post("bus/bus/agregar", data);
      console.log(res);
      limpiar();
      obtenerInfo();
    } catch (error) {
      console.log(error);
    }
  } else {
    let id = idBus.value
    if (id) {
      const data = {
        cantidad_asientos: cantidad_asientos.value,
        empresa_asignada: empresa_asignada.value,
      };
      try {
        let r = await axios.put(`bus/bus/${id}`, data);
        console.log(r);
        obtenerInfo();
        limpiar();
        fixed.value = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function limpiar() {
  placa.value = ""
  numero_bus.value = ""
  cantidad_asientos = ""
  empresa_asignada = ""
}

let idBus = ref('')
async function EditarBus(id) {
  cambio.value = 1;
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
    idBus.value = String(busSeleccionado._id); 
    fixed.value = true;
    text.value = "Editar Bus";
    cantidad_asientos.value = busSeleccionado.cantidad_asientos;
    empresa_asignada.value = busSeleccionado.empresa_asignada;
  }
}

async function InactivarBus(id) {
  try {
    let r = await axios.put(`bus/inactivarBus/${id}`)
    console.log(r);
  } catch (error) {
    console.log(error, "Error al cambiar el estado del bus");
  }
  obtenerInfo();
}

async function ActivarBus(id){
  try {
    let r = await axios.put(`bus/activarBus/${id}`)
    console.log(r);
  } catch (error) {
    console.log(error, "Error al cambiar el estado del bus");
  }
  obtenerInfo();
}

onMounted(() => {
  obtenerInfo();
});
</script>

<style scoped>
.modal-content {
  width: 400px;
}

.botones button {
  margin: 2px;
}

.btn-agregar {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end
}

.volver {
  width: 100%;
  margin-top: 5px;
}
</style>