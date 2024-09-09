import originalModule from 'expo-router';
import { jest } from '@jest/globals';

module.exports = {
  ...originalModule,
  useLocalSearchParams: jest.fn(),
  router: {
    replace: jest.fn()
  }
};
