import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Icon from '@react-native-vector-icons/ionicons';

type SegmentControlProps = {
  options: string[];
  selectedOption: string;
  onOptionPress?: (option: string) => void;
};

const SegmentControl: React.FC<SegmentControlProps> = React.memo(
  ({ options, selectedOption, onOptionPress }) => {
    const { width: windowWidth } = useWindowDimensions();

    const internalPadding = 20;
    const segmentedControlWidth = windowWidth - 40;
    const itemWidth =
      (segmentedControlWidth - internalPadding) / options.length;

    const rStyle = useAnimatedStyle(() => {
      'worklet';
      return {
        left: withTiming(
          itemWidth * options.indexOf(selectedOption) + internalPadding / 2
        ),
      };
    }, [selectedOption, options, itemWidth]);

    // Define icons for each option (customize based on your needs)
    const icons = {
      'Your Friends': 'people',
      'Pending Requests': 'hourglass',
      'Add Friends': 'person-add',
      'Blocked Users': 'ban',
    };

    return (
      <View
        style={[styles.container, { width: segmentedControlWidth, paddingLeft: internalPadding / 2 }]}
      >
        <Animated.View
          style={[{ width: itemWidth }, rStyle, styles.activeBox]}
        />
        {options.map((option) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onOptionPress?.(option);
              }}
              key={option}
              style={[
                { width: itemWidth },
                styles.labelContainer,
                selectedOption === option && styles.selectedLabelContainer,
              ]}
            >
              <Icon
                name={icons[option]} // Dynamically use the icon for the current option
                size={20} // Icon size (can be adjusted)
                color={selectedOption === option ? '#FFF' : '#333'} // Change icon color based on selection
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  selectedOption === option && styles.selectedLabelText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80, // Increased height for better spacing
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    padding: 10,
  },
  activeBox: {
    position: 'absolute',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    height: '95%',
    // top: '10%',
    backgroundColor: '#1E2A78',
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#F5F5F5',
    flexDirection: 'column', // Change to column to stack icon above text
    paddingHorizontal: 10,
  },
  selectedLabelContainer: {
    backgroundColor: '#1E2A78',
  },
  label: {
    fontSize: 12,
    color: '#333',
    marginTop: 5, // Space between icon and text
    textAlign: 'center',
  },
  selectedLabelText: {
    color: '#FFF',
  },
  icon: {
     // Space between icon and text (if needed)
  },
});

export { SegmentControl };
