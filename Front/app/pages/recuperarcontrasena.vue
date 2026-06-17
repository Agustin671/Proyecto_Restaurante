<template>
  <div style="max-width: 400px; margin: 50px auto; font-family: Arial, sans-serif;">
    <h2 style="text-align: center;">Crear Nueva Contraseña</h2>
    <p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 20px;">
      Ingresa el token de seguridad que recibiste y tu nueva contraseña.
    </p>
    
    <form @submit.prevent="cambiarPassword" style="display: flex; flex-direction: column; gap: 15px;">
      <input 
        v-model="token" 
        type="text" 
        placeholder="Pega tu token aquí" 
        required 
        style="padding: 10px; font-size: 16px;" 
      />
      <input 
        v-model="newPassword" 
        type="password" 
        placeholder="Nueva contraseña" 
        required 
        style="padding: 10px; font-size: 16px;" 
      />
      
      <button type="submit" :disabled="cargando" style="padding: 12px; background-color: #28a745; color: white; border: none; font-size: 16px; cursor: pointer; font-weight: bold;">
        {{ cargando ? 'Guardando...' : 'Guardar nueva contraseña' }}
      </button>
    </form>

    <p v-if="mensajeError" style="color: red; text-align: center; margin-top: 15px;">{{ mensajeError }}</p>
    <p v-if="mensajeExito" style="color: green; text-align: center; margin-top: 15px;">{{ mensajeExito }}</p>

    <div style="text-align: center; margin-top: 20px; font-size: 14px;">
      <NuxtLink to="/login" style="color: #007bff; text-decoration: none;">Volver al Login</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const token = ref('')
const newPassword = ref('')
const mensajeError = ref('')
const mensajeExito = ref('')
const cargando = ref(false)

const cambiarPassword = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''
  cargando.value = true

  try {
    const respuesta = await $fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        newPassword: newPassword.value
      }
    })
    
    mensajeExito.value = '¡Contraseña actualizada con éxito!'
    token.value = ''
    newPassword.value = ''
    
    // Opcional: Redirigir al login después de 2 segundos
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)

  } catch (error) {
    mensajeError.value = error.data?.message || 'Error al actualizar. Verifica que el token sea correcto.'
  } finally {
    cargando.value = false
  }
}
</script>