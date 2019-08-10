import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DatePickerAndroid, Alert } from 'react-native';
import { format, isBefore } from 'date-fns';
import en from 'date-fns/locale/en-US';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, DateButton, DateText } from './styles';

export default function DateInput({ date, onChange }) {
  const dateFormatted = useMemo(
    () => format(date, "MMMM dd 'of' yyyy", { locale: en }),
    [date]
  );

  async function handleOpenPicker() {
    const { action, year, month, day } = await DatePickerAndroid.open({
      mode: 'spinner',
      date,
    });

    if (action === DatePickerAndroid.dateSetAction) {
      const selectedDate = new Date(year, month, day);

      if (!isBefore(selectedDate, new Date().setHours(0, 0, 0, 0))) {
        onChange(selectedDate);
      } else {
        Alert.alert(
          'Date not permited!',
          'You can not select a date in the past.'
        );
      }
    }
  }

  return (
    <Container>
      <DateButton onPress={handleOpenPicker}>
        <Icon name="event" size={20} color="#FFF" />
        <DateText>{dateFormatted}</DateText>
      </DateButton>
    </Container>
  );
}

DateInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
