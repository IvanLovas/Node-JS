import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from '../../src/services/public-holidays.service';
import axios from 'axios';
import { PUBLIC_HOLIDAYS_API_URL } from '../../src/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Public Holidays Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListOfPublicHolidays', () => {
    test('should return a list of public holidays for a given year and country', async () => {
      const mockResponse = [{ name: 'New Year', localName: 'Neujahr', date: '2023-01-01' }];
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await getListOfPublicHolidays(2023, 'DE');
      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/2023/DE`);
    });

    test('should return an empty list when an error occurs', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      const result = await getListOfPublicHolidays(2023, 'DE');
      expect(result).toEqual([]);
    });

    test('should throw an error for unsupported country', async () => {
      await expect(getListOfPublicHolidays(2023, 'XX')).rejects.toThrow('Country provided is not supported, received: XX');
    });

    test('should throw an error for non-current year', async () => {
      const nextYear = new Date().getFullYear() + 1;
      await expect(getListOfPublicHolidays(nextYear, 'DE')).rejects.toThrow(`Year provided not the current, received: ${nextYear}`);
    });
  });

  describe('checkIfTodayIsPublicHoliday', () => {
    test('should return true if today is a public holiday', async () => {
      mockedAxios.get.mockResolvedValue({ status: 200 });

      const result = await checkIfTodayIsPublicHoliday('DE');
      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/DE`);
    });

    test('should return false when an error occurs', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      const result = await checkIfTodayIsPublicHoliday('DE');
      expect(result).toBe(false);
    });
  });

  describe('getNextPublicHolidays', () => {
    test('should return the next public holidays for a country', async () => {
      const mockResponse = [{ name: 'Christmas', localName: 'Weihnachten', date: '2023-12-25' }];
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const result = await getNextPublicHolidays('DE');
      expect(result).toEqual(mockResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/DE`);
    });

    test('should return an empty list when an error occurs', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      const result = await getNextPublicHolidays('DE');
      expect(result).toEqual([]);
    });
  });
});