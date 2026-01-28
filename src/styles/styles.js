import { StyleSheet } from 'react-native';

// Import style modules
import { commonStyles } from './common';
import { navigationStyles } from './navigation';
import { contentStyles } from './content';
import { scannerStyles } from './scanner';
import { buttonStyles } from './buttons';
import { modalStyles } from './modal';

// Combine all styles into a single StyleSheet
export const styles = StyleSheet.create({
  ...commonStyles,
  ...navigationStyles,
  ...contentStyles,
  ...scannerStyles,
  ...buttonStyles,
  ...modalStyles,
});

// Also export individual style modules for direct imports
export {
  commonStyles,
  navigationStyles,
  contentStyles,
  scannerStyles,
  buttonStyles,
  modalStyles,
};
