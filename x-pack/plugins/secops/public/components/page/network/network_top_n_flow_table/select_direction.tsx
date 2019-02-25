/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiButtonGroup, EuiButtonGroupProps } from '@elastic/eui';
import React from 'react';
import { pure } from 'recompose';

import { NetworkTopNFlowDirection } from '../../../../graphql/types';
import * as i18n from './translations';

type MyEuiButtonGroupProps = Pick<
  EuiButtonGroupProps,
  'options' | 'idSelected' | 'onChange' | 'color' | 'type'
> & {
  name?: string;
};

const MyEuiButtonGroup: React.SFC<MyEuiButtonGroupProps> = EuiButtonGroup;

const toggleButtonDirection = [
  {
    id: NetworkTopNFlowDirection.uniDirectional,
    label: i18n.UNIDIRECTIONAL,
  },
  {
    id: NetworkTopNFlowDirection.biDirectional,
    label: i18n.BIDIRECTIONAL,
  },
];

interface Props {
  selectedDirection: NetworkTopNFlowDirection;
  onChangeDirection: (value: NetworkTopNFlowDirection) => void;
}

export const SelectDirection = pure<Props>(({ onChangeDirection, selectedDirection }) => (
  <MyEuiButtonGroup
    name="direction"
    options={toggleButtonDirection}
    idSelected={selectedDirection}
    onChange={onChangeDirection}
    color="primary"
    type="single"
  />
));
