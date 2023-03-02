import React from 'react';
import {Button} from 'react-native';

interface IProps {
  handleClose: () => void;
}

export default function CloseButton({handleClose}: IProps) {
  return <Button onPress={handleClose} title="&times;" />;
}
