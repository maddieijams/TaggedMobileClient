import React from 'react';
import {Modal} from 'react-native';

interface IProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: IProps) {
  return <Modal></Modal>;
}
