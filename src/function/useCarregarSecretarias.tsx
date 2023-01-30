import useSWR from "swr";
import axios from "axios";

const useCarregarSecretarias = () => {
  const fetcherGET = (url: string) => axios.get(url).then((res) => res.data);
  
  return useSWR(`${import.meta.env.VITE_API_URL}/secretaria`, fetcherGET);
}

export default useCarregarSecretarias;
