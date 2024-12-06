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

    return (
      <View
        style={[
          styles.container,
          {
            width: segmentedControlWidth,
            borderRadius: 20,
            paddingLeft: internalPadding / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: itemWidth,
            },
            rStyle,
            styles.activeBox,
          ]}
        />
        {options.map((option) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onOptionPress?.(option);
              }}
              key={option}
              style={[
                {
                  width: itemWidth,
                },
                styles.labelContainer,
                selectedOption === option && styles.selectedLabelContainer, // Style for selected option
              ]}
            >
              <Text
                style={[
                  styles.label,
                  selectedOption === option && styles.selectedLabelText, // Style for selected text
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
    height: 55,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    position: 'relative', 
    overflow: 'hidden', 
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
    height: '80%',
    top: '10%',
    backgroundColor: '#1E2A78',
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#F5F5F5', 
  },
  selectedLabelContainer: {
    backgroundColor: '#1E2A78', 
  },
  label: {
    fontSize: 16,
    color: '#333', 
  },
  selectedLabelText: {
    color: '#FFF', 
  },
});

export { SegmentControl };
