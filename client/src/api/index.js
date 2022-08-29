import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' })

// ------------------------------------------------------------------------------------------------

export const submitForm = (id, formData) => API.post(`/data/saveData/${id}`,formData);

export const submitParams = (customParams) => API.post(`/data/saveParams`,customParams);

// -----------------------------------------------------------------------------------------------

export const signin = (formData) => API.post('/users/signin', formData);

export const signup = (formData) => API.post('/users/signup', formData);

// -------------------------------------------------------------------------------------------------

export const trainModel = async (id) => await API.get(`/model/train/${id}`);
export const instantiateDemoBot = async (id) => await API.get(`/model/instantiateDemoBot/${id}`);
export const instantiateModel = async (id) => await API.get(`/model/instantiate/${id}`);
export const predict = async (statement) => await API.post(`/model/predict`, {statement});