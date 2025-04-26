import Swal from "sweetalert2";

export const habitDeleteNotification = () => {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el hábito permanentemente.",
    icon: "warning",
    width: "400px",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
};

export const habitDeleteNotificationConfirmation = () => {
  return Swal.fire({
    title: "Eliminado",
    icon: "success",
    text: "El habito ha sido eliminado",
    width: "400px",
  });
};

export const habitInfoNotification = (habitDescription: string) => {
  return Swal.fire({
    title: "Descripción",
    text: habitDescription || "No hay descripción para este hábito",
    icon: "info",
    width: "400px",
    confirmButtonColor: "green",
    cancelButtonText: "Cancelar",
  });
};

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
