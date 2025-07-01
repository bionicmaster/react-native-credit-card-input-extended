import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {
  CreditCardView,
  CreditCardInput,
  LiteCreditCardInput,
  type CreditCardFormData,
  type CreditCardFormField,
  type ValidationState,
} from 'react-native-credit-card-input-extended';

const s = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 60,
  },
  switch: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  cardView: {
    alignSelf: 'center',
    marginTop: 15,
  },
  cardInput: {
    marginTop: 15,
    borderColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#dfdfdf',
    borderRadius: 5,
  },
  info: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      web: 'monospace',
    }),
  },
});

const toStatusIcon = (status?: ValidationState) =>
  status === 'valid' ? '✅' : status === 'invalid' ? '❌' : '❓';

const errorMessages = {
  number: {
    invalid: 'Invalid card number',
    incomplete: 'Incomplete card number',
  },
  expiry: {
    invalid: 'Invalid expiry date',
    incomplete: 'Incomplete expiry date',
  },
  cvc: {
    invalid: 'Invalid CVC',
    incomplete: 'Incomplete CVC',
  },
  name: 'Name is required',
};

export default function Example() {
  const [useLiteInput, setUseLiteInput] = useState(false);

  const [focusedField, setFocusedField] = useState<CreditCardFormField>();

  const [formData, setFormData] = useState<CreditCardFormData>();

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Switch
        style={s.switch}
        onValueChange={(v: any) => {
          setUseLiteInput(v);
          setFormData(undefined);
        }}
        value={useLiteInput}
      />

      <CreditCardView
        focusedField={focusedField}
        type={formData?.values.type}
        number={formData?.values.number}
        expiry={formData?.values.expiry}
        cvc={formData?.values.cvc}
        name={formData?.values.name}
        style={s.cardView}
        monthYearLabel="MONTH/YEAR"
      />

      {useLiteInput ? (
        <LiteCreditCardInput
          autoFocus
          style={s.cardInput}
          onChange={setFormData}
          onFocusField={setFocusedField}
        />
      ) : (
        <CreditCardInput
          focusedField={focusedField}
          autoFocus
          requiresName
          style={s.cardInput}
          formData={formData}
          onChange={setFormData}
          onFocusField={setFocusedField}
          errorMessages={errorMessages}
          labels={{
            number: 'Card Number',
            expiry: 'Expiry',
            cvc: 'CVC',
            name: 'Holder Name',
          }}
          placeholders={{
            number: '1234 5678 1234 5678',
            expiry: 'MM/AA',
            cvc: '123',
            name: 'JOHN DOE',
          }}
        />
      )}

      <View style={s.infoContainer}>
        <Text style={s.info}>
          {formData?.valid
            ? '✅ Possibly valid card'
            : '❌ Invalid/Incomplete card'}
        </Text>

        <Text style={s.info}>
          {toStatusIcon(formData?.status.number)}
          {' Number\t: '}
          {formData?.values.number}
        </Text>

        <Text style={s.info}>
          {toStatusIcon(formData?.status.expiry)}
          {' Expiry\t: '}
          {formData?.values.expiry}
        </Text>

        <Text style={s.info}>
          {toStatusIcon(formData?.status.cvc)}
          {' Cvc   \t: '}
          {formData?.values.cvc}
        </Text>

        <Text style={s.info}>
          {'ℹ️ Type  \t: '}
          {formData?.values.type}
        </Text>

        <Text style={s.info}>
          {'📛 Name  \t: '}
          {formData?.values.name}
        </Text>
      </View>
    </ScrollView>
  );
}
