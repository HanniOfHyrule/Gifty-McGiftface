import axios, { AxiosResponse } from 'axios';
import { Birthday, Statistics, UpcomingBirthday } from './entities';

const API_BASE_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const birthdayApi = {
  getAllBirthdays: (): Promise<Birthday[]> =>
    api
      .get<Birthday[]>('/birthdays')
      .then((res: AxiosResponse<Birthday[]>) => res.data),

  getUpcomingBirthdays: (days?: number): Promise<UpcomingBirthday[]> =>
    api
      .get<UpcomingBirthday[]>(
        `/birthdays/upcoming${days ? `?days=${days}` : ''}`,
      )
      .then((res) => res.data),

  getStatistics: (): Promise<Statistics> =>
    api.get<Statistics>('/birthdays/statistics').then((res) => res.data),

  getBirthdaysByMonth: (month: number): Promise<Birthday[]> =>
    api.get<Birthday[]>(`/birthdays/by-month/${month}`).then((res) => res.data),

  uploadCsv: (
    file: File,
  ): Promise<{ message: string; imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post('/birthdays/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  generateSampleData: (): Promise<{ message: string; count: number }> =>
    api.post('/birthdays/generate-sample').then((res) => res.data),
};
