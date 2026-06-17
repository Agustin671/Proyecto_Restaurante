<template>
  <div style="max-width: 400px; margin: 100px auto; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f8f9fa; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Registro de Usuario</h2>
    
    <form @submit.prevent="registrar" style="display: flex; flex-direction: column; gap: 15px;">
      <div>
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Nombre completo:</label>
        <input v-model="formulario.nombre" type="text" placeholder="Ej: Carlos Pérez" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" />
      </div>

      <div>
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Correo electrónico:</label>
        <input v-model="formulario.email" type="email" placeholder="Ej: usuario@correo.com" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" />
      </div>

      <div>
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Contraseña:</label>
        <input v-model="formulario.password" type="password" placeholder="********" required style="width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" />
      </div>

      <button type="submit" style="padding: 12px; background-color: #28a745; color: white; border: none; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px;">
        Crear Cuenta
      </button>
    </form>

    <p v-if="mensajeError" style="color: #dc3545; text-align: center; margin-top: 15px; font-weight: bold;">
      {{ mensajeError }}
    </p>

    <p v-if="mensajeExito" style="color: #28a745; text-align: center; margin-top: 15px; font-weight: bold;">
      {{ mensajeExito }}
    </p>

    <div style="text-align: center; margin-top: 25px; border-top: 1px solid #ddd; padding-top: 15px;">
      <p style="margin: 0; color: #666; font-size: 14px;">¿Ya tienes una cuenta?</p>
      <NuxtLink to="/login" style="color: #007bff; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 5px;">
        Iniciar Sesión aquí
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formulario = ref({
  nombre: '',
  email: '',
  password: ''
})

const mensajeError = ref('')
const mensajeExito = ref('')

const registrar = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''
  
  try {
    await $fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      body: formulario.value
    })

    mensajeExito.value = '¡Registrado correctamente! Redireccionando al login...'
    
    // Limpiamos los campos del formulario
    formulario.value = { nombre: '', email: '', password: '' }

    // Pausa de 1.5 segundos para que alcancen a leer el mensaje de éxito antes de viajar
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)

  } catch (error) {
    console.error('Error en el registro:', error)
    // Captura el mensaje de error personalizado enviado desde tu AppError del backend
    mensajeError.value = error.data?.message || 'Hubo un problema al conectar con el servidor.'
  }
}
</script>