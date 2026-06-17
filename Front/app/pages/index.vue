<template>
  <div style="text-align: center; margin-top: 50px; font-family: Arial;">
    <h1>Bienvenido al Sistema del Restaurante</h1>
    <p>¿Qué deseas hacer?</p>
    
    <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center;">
      <NuxtLink to="/registro" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
        Crear Cuenta
      </NuxtLink>
      <NuxtLink to="/login" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Iniciar Sesión
      </NuxtLink>
    </div>
  </div>
</template>