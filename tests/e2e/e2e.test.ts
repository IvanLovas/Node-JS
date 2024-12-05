import supertest from 'supertest';

const api = supertest('https://date.nager.at/api/v3');

describe('Nager.Date API E2E', () => {
  test('should fetch public holidays for Germany in 2023', async () => {
    const response = await api.get('/PublicHolidays/2023/DE');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should check if today is a public holiday in Germany', async () => {
    const response = await api.get('/IsTodayPublicHoliday/DE');
    expect([200, 204]).toContain(response.status);
    if (response.status === 200) {
      expect(typeof response.body).toBe('boolean');
    }
  });
});