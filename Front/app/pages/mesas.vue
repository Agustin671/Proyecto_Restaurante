<template>
  <div style="max-width: 850px; margin: 50px auto; font-family: Arial, sans-serif;">
    <h2 style="text-align: center;">Gestión de Mesas</h2>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <NuxtLink to="/comandas" style="padding: 8px 12px; background-color: #17a2b8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Ir a Comandas ➡️</NuxtLink>
      <button @click="cerrarSesion" style="padding: 8px 12px; background-color: #dc3545; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: bold;">Cerrar Sesión</button>
    </div>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ddd;">
      <h3>Nueva Mesa</h3>
      <form @submit.prevent="crearMesa" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 10px;">
          <input v-model="nuevaMesa.numero" type="number" placeholder="N° de Mesa" required style="width: 25%; padding: 8px;" />
          <input v-model="nuevaMesa.ubicacion" type="text" placeholder="Ubicación" required style="width: 50%; padding: 8px;" />
          <input v-model="nuevaMesa.capacidad" type="number" placeholder="Capacidad" required style="width: 25%; padding: 8px;" />
        </div>
        <button type="submit" style="padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">Agregar Mesa</button>
      </form>
      <p v-if="mensajeErrorCrear" style="color: red; margin-top: 10px; font-weight: bold;">{{ mensajeErrorCrear }}</p>
    </div>

    <div v-if="mensajeErrorNegocio" :style="{ backgroundColor: mensajeErrorNegocio.includes('✅') ? '#d4edda' : '#f8d7da', color: mensajeErrorNegocio.includes('✅') ? '#155724' : '#721c24', padding: '12px', borderRadius: '4px', border: '1px solid', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }">
      {{ mensajeErrorNegocio }}
    </div>

    <div v-if="accionPendiente" style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; margin-bottom: 20px; text-align: center; border-radius: 4px; font-weight: bold;">
      <p>¿Estás seguro de que quieres {{ accionPendiente.texto }}?</p>
      <button @click="ejecutarAccion" style="background: #28a745; color: white; border: none; padding: 6px 15px; margin-right: 10px; cursor: pointer; border-radius: 4px;">Confirmar</button>
      <button @click="accionPendiente = null" style="background: #6c757d; color: white; border: none; padding: 6px 15px; cursor: pointer; border-radius: 4px;">Cancelar</button>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: left;">
      <thead>
        <tr style="background-color: #f1f1f1; border-bottom: 2px solid #ddd;">
          <th style="padding: 12px;">ID Sistema</th><th>N°</th><th>Ubicación</th><th>Capacidad</th><th>Estado</th><th style="text-align: center;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mesa in listaMesas" :key="mesa.id" style="border-bottom: 1px solid #ddd;">
          <td style="padding: 12px;">{{ mesa.id }}</td>
          <td style="padding: 12px;">Mesa {{ mesa.numero }}</td>
          <td style="padding: 12px;">{{ mesa.ubicacion }}</td>
          <td style="padding: 12px;">{{ mesa.capacidad }} pers.</td>
          <td style="padding: 12px;"><span :style="{ padding: '4px 8px', borderRadius: '4px', backgroundColor: mesa.estado === 'Libre' ? '#d4edda' : '#f8d7da' }">{{ mesa.estado }}</span></td>
          <td style="padding: 12px; text-align: center;">
            <button v-if="mesa.estado === 'Libre'" @click="cambiarEstadoMesa(mesa.id, 'Ocupada')" style="padding: 4px 8px; background-color: #cb6206; color: white;">Ocupar</button>
            <button v-if="mesa.estado === 'Ocupada'" @click="prepararAccion('cerrar', mesa.id, 'cerrar la cuenta de esta mesa')" style="padding: 4px 8px; background-color: #03852a; color: white;">Cerrar Cuenta</button>
            <button v-if="mesa.estado === 'Ocupada'" @click="cambiarEstadoMesa(mesa.id, 'Libre')" style="padding: 4px 8px; background-color: #cb6206; color: white;">Liberar</button>
            <button @click="prepararAccion('borrar', mesa.id, 'borrar esta mesa permanentemente')" style="padding: 4px 8px; background-color: #dc3545; color: white;">Borrar</button>
          </td>
        </tr>
      </tbody>  
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const listaMesas = ref([])
const nuevaMesa = ref({ numero: '', ubicacion: '', capacidad: '', estado: 'Libre' })
const mensajeErrorCrear = ref('')
const mensajeErrorNegocio = ref('')
const filtroActual = ref('')
const accionPendiente = ref(null)

const btnFiltroStyle = (activo) => ({ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activo ? '#007bff' : '#f8f9fa', color: activo ? 'white' : '#333' })

const cargarMesas = async (estado = '') => {
  filtroActual.value = estado
  mensajeErrorNegocio.value = ''
  try {
    const token = localStorage.getItem('token_restaurante')
    let url = 'http://localhost:3000/mesas'
    if (estado !== '') url += `?estado=${estado}`
    const respuesta = await $fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    listaMesas.value = respuesta.data || []
  } catch (e) { if (e.status === 401 || e.status === 403) navigateTo('/login') }
}

const prepararAccion = (tipo, id, texto) => { accionPendiente.value = { tipo, id, texto } }

const ejecutarAccion = async () => {
  const { tipo, id } = accionPendiente.value
  accionPendiente.value = null
  if (tipo === 'borrar') await eliminarMesa(id)
  else if (tipo === 'cerrar') await cerrarCuenta(id)
}

const crearMesa = async () => {
  try {
    const token = localStorage.getItem('token_restaurante')
    await $fetch('http://localhost:3000/mesas', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: nuevaMesa.value })
    nuevaMesa.value = { numero: '', ubicacion: '', capacidad: '', estado: 'Libre' }
    cargarMesas(filtroActual.value)
  } catch (e) { mensajeErrorCrear.value = "Error al guardar." }
}

const cambiarEstadoMesa = async (id, estado) => {
  mensajeErrorNegocio.value = ''
  try {
    const token = localStorage.getItem('token_restaurante')
    await $fetch(`http://localhost:3000/mesas/${id}`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }, body: { estado } })
    cargarMesas(filtroActual.value)
  } catch (e) { mensajeErrorNegocio.value = (e.data?.message || "Error al cambiar estado.") }
}

const cerrarCuenta = async (id) => {
  mensajeErrorNegocio.value = ''
  try {
    const token = localStorage.getItem('token_restaurante')
    const res = await $fetch(`http://localhost:3000/mesas/${id}/close`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
    mensajeErrorNegocio.value = `Cuenta cerrada. Total: $${res.data.total} (Propina: $${res.data.totalConPropina})`
    cargarMesas(filtroActual.value)
  } catch (e) { mensajeErrorNegocio.value = (e.data?.message || "Error al cerrar cuenta") }
}

const eliminarMesa = async (id) => {
  mensajeErrorNegocio.value = ''
  try {
    const token = localStorage.getItem('token_restaurante')
    await $fetch(`http://localhost:3000/mesas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    mensajeErrorNegocio.value = " Mesa eliminada correctamente."
    cargarMesas(filtroActual.value)
  } catch (e) { mensajeErrorNegocio.value = " Error al eliminar mesa." }
}

const cerrarSesion = () => { localStorage.removeItem('token_restaurante'); navigateTo('/') }
onMounted(cargarMesas)
</script>