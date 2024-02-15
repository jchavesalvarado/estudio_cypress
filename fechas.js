let fecha = new Date();

const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "long",
    hour12: true,
    timeZone: 'America/Bogota'
  };

  const fechaCompleta = new Intl.DateTimeFormat('es-CO', options).format(fecha);
  console.log(fechaCompleta);