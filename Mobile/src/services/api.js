  
import { create } from 'apisauce';

const api = create({
  baseURL: 'http://192.168.4.154:8008'
});
  

api.addResponseTransform(response => {
  if (!response.ok) throw response;
});

export default api;