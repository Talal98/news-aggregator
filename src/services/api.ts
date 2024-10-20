// src/services/api.ts
import axios from 'axios';

export const newsApi = async (params: any) => {
  params.apiKey = '1e057c312350455a8a063259fc536e57'
  const response = await axios.get(`https://newsapi.org/v2/top-headlines`, { params });
  return response.data.articles;
};
