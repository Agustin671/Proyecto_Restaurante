<template>
  <div style="max-width: 950px; margin: 50px auto; font-family: Arial, sans-serif;">
    <h2 style="text-align: center;">Gestión de Comandas</h2>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <NuxtLink to="/mesas" style="padding: 8px 12px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
        ⬅️ Volver a Mesas
      </NuxtLink>
      <button @click="cerrarSesion" style="padding: 8px 12px; background-color: #dc3545; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">
        Cerrar Sesión
      </button>
    </div>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ddd;">
      <h3>Nuevo Pedido</h3>
      <form @submit.prevent="crearComanda" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 10px;">
          <input v-model="nuevaComanda.mesaId" type="number" placeholder="ID Mesa" required style="width: 15%; padding: 8px;" />
          <input v-model="nuevaComanda.detalle" type="text" placeholder="Ej: Salmón, Bebida" required style="width: 60%; padding: 8px;" />
          <input v-model="nuevaComanda.total" type="number" placeholder="Total $" required style="width: 25%; padding: 8px;" />
        </div>
        <button type="submit" style="padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">
          Ingresar Pedido
        </button>
      </form>
      <p v-if="mensajeError" style="color: red; margin-top: 10px; font-weight: bold;">{{ mensajeError }}</p>
    </div>

    <h3>Historial de Pedidos</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left;">
      <thead>
        <tr style="background-color: #f1f1f1; border-bottom: 2px solid #ddd;">
          <th style="padding: 12px;">Mesa</th>
          <th style="padding: 12px;">Detalle</th>
          <th style="padding: 12px;">Total</th>
          <th style="padding: 12px;">Estado</th>
          <th style="padding: 12px; text-align: center;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comanda in listaComandas" :key="comanda.id" style="border-bottom: 1px solid #ddd;">
          <td style="padding: 12px;">N° {{ comanda.mesaId }}</td>
          <td style="padding: 12px;">{{ comanda.detalle }}</td>
          <td style="padding: 12px; font-weight: bold;">${{ comanda.total }}</td>
          <td style="padding: 12px;">
            <span :style="{ padding: '4px 8px', borderRadius: '4px', backgroundColor: comanda.estado === 'Entregado' ? '#d4edda' : '#ffeeba' }">
              {{ comanda.estado }}
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <button v-if="comanda.estado !== 'Entregado'" @click="actualizarEstado(comanda.id, 'Entregado')" style="padding: 4px 8px; background-color: #28a745; color: white; border: none; cursor: pointer;">
              Entregar 
            </button>
            <button @click="eliminarComanda(comanda.id)" style="padding: 4px 8px; background-color: #dc3545; color: white; border: none; cursor: pointer;">
              Borrar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const listaComandas = ref([])
const nuevaComanda = ref({ mesaId: '', detalle: '', total: '', estado: 'En Preparación' })
const mensajeError = ref('')

const cargarComandas = async () => {
  const token = localStorage.getItem('token_restaurante')
  const res = await $fetch('http://localhost:3000/comandas', { headers: { 'Authorization': `Bearer ${token}` } })
  listaComandas.value = res.data || []
}

const crearComanda = async () => {
  try {
    const token = localStorage.getItem('token_restaurante')
    await $fetch('http://localhost:3000/comandas', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: nuevaComanda.value
    })
    nuevaComanda.value = { mesaId: '', detalle: '', total: '', estado: 'En Preparación' }
    cargarComandas()
  } catch (e) { mensajeError.value = "Error al crear pedido." }
}

const actualizarEstado = async (id, estado) => {
  try {
    const token = localStorage.getItem('token_restaurante')
    await $fetch(`http://localhost:3000/comandas/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { estado }
    })
    cargarComandas()
  } catch (e) { alert((e.data?.message || "Error al actualizar")) }
}

const eliminarComanda = async (id) => {
  const token = localStorage.getItem('token_restaurante')
  await $fetch(`http://localhost:3000/comandas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
  cargarComandas()
}

const cerrarSesion = () => { localStorage.removeItem('token_restaurante'); navigateTo('/') }
onMounted(cargarComandas)
</script>