import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from '../../src/services/public-holidays.service';

describe('Public Holidays Service Integration', () => {
  test('should return a list of public holidays for the year 2023 in Germany', async () => {
    const result = await getListOfPublicHolidays(2023, 'DE');
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
  });

  test('should return if today is a public holiday in Germany', async () => {
    const result = await checkIfTodayIsPublicHoliday('DE');
    expect(typeof result).toBe('boolean');
  });

  test('should return the next public holidays in Germany', async () => {
    const result = await getNextPublicHolidays('DE');
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
  });
});