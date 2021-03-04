import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { create } from 'tailwind-rn';
import styles from '../../../styles.json';
const { tailwind } = create(styles);

import Svg, { Path } from 'react-native-svg';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomDatePicker = ({label = "Select Date"}) => {
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [datepickerValue, setDatepickerValue] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [noOfDays, setNoOfDays] = useState([]);
  const [days] = useState(DAYS);

  useEffect(() => {
    console.log('datepickerValue = ', datepickerValue);
  }, [datepickerValue]);

  const initDate = () => {
    let today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setDatepickerValue(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).toDateString()
    );
    getNoOfDays();
  };

  useEffect(() => {
    initDate();
  }, []);

  const isToday = (date) => {
    const today = new Date();
    const d = new Date(year, month, date);

    return today.toDateString() === d.toDateString() ? true : false;
  };

  const getDateValue = (date) => {
    let selectedDate = new Date(year, month, date);
    setDatepickerValue(selectedDate.toDateString());
    setShowDatepicker(false);
  };

  const getNoOfDays = (m = month, y = year) => {
    let daysInMonth = new Date(y, m + 1, 0).getDate();
    let dayOfWeek = new Date(y, m).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    let finalDaysArray = [];
    let segmentArray = [];
    for (let i = 0; i < blankdaysArray.length; i++) {
      segmentArray.push(0);
    }
    for (let i = 0; i < daysArray.length; i++) {
      if (segmentArray.length === 6) {
        segmentArray.push(daysArray[i]);
        finalDaysArray.push(segmentArray);
        segmentArray = [];
      } else if (i === daysArray.length - 1) {
        segmentArray.push(daysArray[i]);
        for (let k = segmentArray.length; k < 7; k++) {
          segmentArray.push(0);
        }
        finalDaysArray.push(segmentArray);
        segmentArray = [];
      } else {
        segmentArray.push(daysArray[i]);
      }
    }
    setNoOfDays(finalDaysArray);
  };

  const onBackwardPress = () => {
    let newMonth = month;
    let newYear = year;
    if (month === 0) {
      (newMonth = 11), (newYear = year - 1);
    } else {
      newMonth = month - 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    getNoOfDays(newMonth, newYear);
  };

  const onForwardPress = () => {
    let newMonth = month;
    let newYear = year;
    if (month === 11) {
      (newMonth = 0), (newYear = year + 1);
    } else {
      newMonth = month + 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    getNoOfDays(newMonth, newYear);
  };

  const onInputFocus = () => {
    setShowDatepicker(!showDatepicker);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowDatepicker(false)}>
      <View style={sheetStyles.mainContainer}>
        <View style={sheetStyles.container}>
          {label && <Text style={sheetStyles.labelStyle}>{label}</Text>}
          <View style={sheetStyles.mainWrapper}>
            <TextInput
              style={sheetStyles.hiddenInputStyle}
              type="hidden"
              name="date"
              value={datepickerValue}
            />
            <TextInput
              type="text"
              editable={false}
              value={datepickerValue}
              style={
                showDatepicker
                  ? sheetStyles.inputStyleFocused
                  : sheetStyles.inputStyle
              }
              placeholder="Select date"
            />
            <TouchableOpacity
              onPress={onInputFocus}
              style={sheetStyles.touchControlStyle}
            />

            <View style={sheetStyles.calenderIconWrapper}>
              <Svg
                style={sheetStyles.calenderIconStyle}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </Svg>
            </View>

            {showDatepicker && (
              <TouchableWithoutFeedback>
                <View style={sheetStyles.dropDownContainer}>
                  <View style={sheetStyles.calenderHeader}>
                    <View style={sheetStyles.calenderHeaderTextWrapper}>
                      <Text style={sheetStyles.calenderHeaderTextMonth}>
                        {MONTH_NAMES[month]}
                      </Text>
                      <Text style={sheetStyles.calenderHeaderTextYear}>
                        {year}
                      </Text>
                    </View>
                    <View style={sheetStyles.buttonSectionWrapper}>
                      <TouchableOpacity
                        style={sheetStyles.buttonWrapper}
                        onPress={() => onBackwardPress()}
                      >
                        <Svg
                          style={sheetStyles.buttonIconStyle}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <Path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </Svg>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={sheetStyles.buttonWrapper}
                        onPress={() => onForwardPress()}
                      >
                        <Svg
                          style={sheetStyles.buttonIconStyle}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <Path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={sheetStyles.daysRowStyle}>
                    {days.map((day) => {
                      return (
                        <View key={day} style={sheetStyles.daysTextWrapper}>
                          <Text key={day} style={sheetStyles.daysTextStyle}>
                            {day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <View style={sheetStyles.dateRows}>
                    {noOfDays.map((dateSegments, index) => {
                      return (
                        <View key={index} style={sheetStyles.dateTextWrapper}>
                          {dateSegments.map((date, index) => {
                            return date === 0 ? (
                              <Text
                                key={index}
                                style={sheetStyles.blankDatesTextStyle}
                              ></Text>
                            ) : (
                              <TouchableOpacity
                                key={index}
                                style={
                                  isToday(date) == true
                                    ? sheetStyles.selectedDateNumberStyle
                                    : sheetStyles.dateNumberStyle
                                }
                                onPress={() => getDateValue(date)}
                              >
                                <Text
                                  style={
                                    isToday(date) === true
                                      ? sheetStyles.highlightedDateTextStyle
                                      : sheetStyles.dateTextStyle
                                  }
                                >
                                  {date}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomDatePicker;

const sheetStyles = StyleSheet.create({
  inputStyle: {
    ...tailwind(
      'w-full pl-4 pr-10 py-3 bg-white rounded-2xl text-gray-600 font-medium border-4 border-blue-400 border-opacity-0'
    ),
  },
  inputStyleFocused: {
    ...tailwind(
      'w-full pl-4 pr-10 py-3 bg-white rounded-2xl text-gray-600 font-medium border-4 border-blue-400'
    ),
  },
  dateNumberStyle: {
    ...tailwind('flex justify-center items-center rounded-full h-7 w-7'),
  },
  selectedDateNumberStyle: {
    ...tailwind(
      'flex justify-center items-center rounded-full bg-blue-500 text-white font-medium text-center text-xs h-7 w-7'
    ),
  },
  mainContainer: {
    ...tailwind('h-full w-full flex pt-10 bg-gray-200'),
  },
  container: {
    ...tailwind('container ml-4 mb-5 w-64'),
  },
  labelStyle: {
    ...tailwind('font-bold mb-1 text-gray-700'),
  },
  mainWrapper: {
    ...tailwind('relative'),
  },
  hiddenInputStyle: {
    ...tailwind('w-0 h-0'),
  },
  touchControlStyle: {
    ...tailwind('absolute w-full h-14'),
  },
  calenderIconWrapper: {
    ...tailwind('absolute top-0 right-0 px-3 py-3'),
  },
  calenderIconStyle: {
    ...tailwind('h-6 w-6 text-gray-400'),
  },
  dropDownContainer: {
    ...tailwind('bg-white mt-16 rounded-lg p-4 absolute top-0 left-0 w-80'),
  },
  buttonSectionWrapper: {
    ...tailwind('flex flex-row'),
  },
  buttonWrapper: {
    ...tailwind('p-1 rounded-full'),
  },
  buttonIconStyle: {
    ...tailwind('h-6 w-6 text-gray-500'),
  },
  calenderHeader: {
    ...tailwind('flex flex-row justify-between items-center mb-2'),
  },
  calenderHeaderTextWrapper: {
    ...tailwind('flex flex-row'),
  },
  calenderHeaderTextMonth: {
    ...tailwind('text-lg font-bold text-gray-800'),
  },
  calenderHeaderTextYear: {
    ...tailwind('ml-1 text-lg text-gray-600 font-normal'),
  },
  daysRowStyle: {
    ...tailwind('flex-row justify-between mb-3 -mx-1'),
  },
  daysTextWrapper: {
    ...tailwind('text-gray-800 font-medium text-center text-xs w-1/7'),
  },
  daysTextStyle: {
    ...tailwind('text-center'),
  },
  blankDatesTextStyle: {
    ...tailwind('w-7 h-7'),
  },
  dateTextWrapper: {
    ...tailwind('flex-row justify-around mb-3 w-full'),
  },
  highlightedDateTextStyle: {
    ...tailwind('font-medium text-xs text-white'),
  },
  dateTextStyle: {
    ...tailwind('font-medium text-xs text-gray-700'),
  },
  dateRows: {
    ...tailwind('-mx-1'),
  },
});
