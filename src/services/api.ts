// src/services/api.ts
import axios from 'axios';

export const newsApi = async (params: any) => {
  params.apiKey = 'd5e896e8566d4e0d8fb9ea59816080e6'
  const response = await axios.get(`https://newsapi.org/v2/top-headlines`, { params });
  return response.data.articles;
};

export const guardianApi = async (params: any) => {
  params["api-key"] = '2123ea32-b8f2-427b-b7d9-a8e8fa56ab2d'
  params["page-size"] = 200
  params["show-fields"] = 'thumbnail,trailText'
  params["order-by"] = 'newest'
  const response = await axios.get(`https://content.guardianapis.com/search`, { params });
  return response?.data?.response?.results;
};

export const newYorkTimesApi = async (params: any) => {
  params["api-key"] = 'yftUizkj5b99g6dd1igWpsbIQJlARVUo';
  params["sort"] = 'newest';
  const response = await axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json`, { params });
  return response?.data?.response?.docs;
}
