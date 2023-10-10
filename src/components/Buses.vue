<template>
  <div>
    <!-- Modal -->
    <q-dialog v-model="fixed">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ text }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh; width:200px "  class="scroll">
          <q-input v-model="nuevaPlaca" label="Placa" />
          <q-input v-model="nuevoNumeroBus" label="Número de Bus" />
          <q-input v-model="nuevaCantidadAsientos" label="Cantidad de Asientos" />
          <q-input v-model="nuevaEmpresaAsignada" label="Empresa Asignada" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn flat label="Guardar 💾" color="primary" @click="guardarBus()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div>
    <h1>Buses</h1>
      <q-btn color="secondary" label="Agregar" @click="agregarBus()" />
        <q-table title="Buses" :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-botones="props">
            <q-td :props="props">
              <q-btn color="primary" label="Editar" @click="EditarBus(props.row._id)" />
              <q-btn color="negative" label="Borrar" @click="borrarBus(props.row._id)" />
              <q-btn color="amber" glossy :label="habilitar"  @click="InactivarBus(props.row._id)" />
            </q-td>
          </template>
        </q-table>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

let apiUrl = 'https://transporte-czaa.onrender.com/api/bus/buses';
let buses = ref([]);
let rows = ref([]);

let fixed = ref(false)

let habilitar = ref('Inactivar')

async function obtenerInfo() {
  try {
    const responseBuses = await axios.get(apiUrl);
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
  { name: 'estado', label: 'Estado', field: 'estado', format: (val) => (val ? 'Activo' : 'Inactivo') },
  { name: 'createAT', label: 'Fecha de Creación', field: 'createAT', sortable: true,
    format: (val) => format(new Date(val), 'yyyy-MM-dd')
  },
  { name: 'botones', label: 'Opciones',
    field: row => null, 
    format: (val, row) => {
      return `
        <q-btn color="primary" label="Editar" @click="editarBus('${row._id}')" />
        <q-btn color="negative" label="Borrar" @click="borrarBus('${row._id}')" />
        <q-btn color="amber" glossy :label="Inactivar"  @click="InactivarBus('${row._id}'/>`;
    },
    "sortable": false, 
  },
];
let text = ref('')
let nuevaPlaca = ref('');
let nuevoNumeroBus = ref('');
let nuevaCantidadAsientos = ref('');
let nuevaEmpresaAsignada = ref('');

function agregarBus() {
  fixed.value = true;
  text.value = "Agregar Bus";
  nuevaPlaca.value = ''; 
  nuevoNumeroBus.value = ''; 
  nuevaCantidadAsientos.value = ''; 
  nuevaEmpresaAsignada.value = ''; 
}

function EditarBus(id) {
  const busSeleccionado = buses.value.find((bus) => bus._id === id);
  if (busSeleccionado) {
    fixed.value = true;
    text.value = "Editar Bus";
    nuevaPlaca.value = busSeleccionado.placa;
    nuevoNumeroBus.value = busSeleccionado.numero_bus;
    nuevaCantidadAsientos.value = busSeleccionado.cantidad_asientos;
    nuevaEmpresaAsignada.value = busSeleccionado.empresa_asignada;
  }
}

function InactivarBus(id){
  try {
    habilitar.value = "Activar"
  } catch (error) {
    console.log(error,"Error al cambiar el estado del bus");
  }
}

onMounted(() => {
  obtenerInfo();
});
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>