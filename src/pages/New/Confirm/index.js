import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatRelative, parseISO } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { TouchableOpacity, Alert } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';

import { Container, Avatar, Name, Time, SubmitButton } from './styles';

export default function Confirm({ navigation }) {
  const provider = navigation.getParam('provider');
  const time = navigation.getParam('time');

  const dateFormatted = useMemo(
    () => formatRelative(parseISO(time), new Date(), { locale: en }),
    [time]
  );

  async function handleScheduleAppointment() {
    try {
      await api.post('appointments', {
        provider_id: provider.id,
        date: time,
      });

      navigation.navigate('Dashboard');
    } catch (err) {
      if (err.response) {
        Alert.alert('Erro!', err.response.data.error);
      } else {
        Alert.alert('Erro!', 'Connection error.');
      }
    }
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: provider.avatar
              ? provider.avatar.url
              : `https://api.adorable.io/avatars/50/${provider.name}.png`,
          }}
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>

        <SubmitButton onPress={handleScheduleAppointment}>Confirm</SubmitButton>
      </Container>
    </Background>
  );
}

Confirm.navigationOptions = ({ navigation }) => ({
  title: 'Confirm new schedule',
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

Confirm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
