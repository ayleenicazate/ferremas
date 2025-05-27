// Manejo del formulario de login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profileType = document.getElementById('profile-type').value;
    const newsletter = document.getElementById('newsletter').checked;

    console.log('Correo:', email);
    console.log('Contraseña:', password);
    console.log('Tipo de Perfil:', profileType);
    console.log('Suscripción a noticias:', newsletter);

    // Aquí puedes agregar lógica para enviar los datos al servidor
    alert('Inicio de sesión enviado');
});

// Botón de inicio de sesión con Google
document.getElementById('google-login').addEventListener('click', function () {
    alert('Función de inicio de sesión con Google aún no implementada.');
});