<template>
  <div style="max-width: 400px; margin: 50px auto; font-family: Arial, sans-serif;">
    <h2 style="text-align: center;">Iniciar Sesión</h2>
    
    <form @submit.prevent="iniciarSesion" style="display: flex; flex-direction: column; gap: 15px;">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Correo electrónico" 
        required 
        style="padding: 10px; font-size: 16px;" 
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Contraseña" 
        required 
        style="padding: 10px; font-size: 16px;" 
      />
      
      <button type="submit" style="padding: 12px; background-color: #007bff; color: white; border: none; font-size: 16px; cursor: pointer; font-weight: bold;">
        Ingresar
      </button>
    </form>

    <p v-if="mensajeError" style="color: red; text-align: center; margin-top: 15px;">{{ mensajeError }}</p>
    <p v-if="mensajeExito" style="color: green; text-align: center; margin-top: 15px;">{{ mensajeExito }}</p>

    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
      <NuxtLink to="/recuperar-password" style="color: #007bff; text-decoration: none;">¿Olvidaste tu contraseña?</NuxtLink>
      <NuxtLink to="/registro" style="color: #007bff; text-decoration: none;">Regístrate aquí</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const mensajeError = ref('')
const mensajeExito = ref('')

const iniciarSesion = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''

  try {
    const respuesta = await $fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    localStorage.setItem('token_restaurante', respuesta.data.accessToken)
    mensajeExito.value = '¡Login exitoso! Redirigiendo al panel...'
    
    email.value = ''
    password.value = ''

    navigateTo('/mesas')
  } catch (error) {
    mensajeError.value = error.data?.message || 'Error al iniciar sesión. Revisa tus datos.'
  }
}
</script>