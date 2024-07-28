import { validateInput, shortenPublicHoliday } from '../../src/helpers';
import { PublicHoliday } from '../../src/types';

describe('Helpers', () => {
  test('validateInput should throw an error for unsupported country', () => {
    expect(() => validateInput({ country: 'XX' })).toThrow('Country provided is not supported, received: XX');
  });

  test('validateInput should throw an error for non-current year', () => {
    const nextYear = new Date().getFullYear() + 1;
    expect(() => validateInput({ year: nextYear })).toThrow(`Year provided not the current, received: ${nextYear}`);
  });

  test('shortenPublicHoliday should return a shortened version of the public holiday', () => {
    const holiday: PublicHoliday = {
      date: '2023-01-01',
      localName: 'Neujahr',
      name: 'New Year',
      countryCode: 'DE',
      fixed: true,
      global: true,
      counties: null,
      launchYear: 2023,
      types: ['Public']
    };

    const shortened = shortenPublicHoliday(holiday);
    expect(shortened).toEqual({ name: 'New Year', localName: 'Neujahr', date: '2023-01-01' });
  });
});