import axios from "axios";

const useEnviarFormulario = () => {
  return (formulario: FormData) => axios.postForm(`${import.meta.env.VITE_API_URL}/cadastro`, formulario, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export default useEnviarFormulario;
