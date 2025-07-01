import { useCallback, useState } from 'react';
import cardValidator from 'card-validator';

export type CreditCardIssuer =
  | 'visa'
  | 'mastercard'
  | 'american-express'
  | 'diners-club'
  | 'discover'
  | 'jcb'
  | 'mir'
  | 'unionpay';

export type CreditCardFormField = 'number' | 'expiry' | 'cvc' | 'name';

export type CreditCardFormValues = {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  type?: CreditCardIssuer;
};

export type ValidationState = 'incomplete' | 'invalid' | 'valid';

export type CreditCardFormState = {
  number: ValidationState;
  expiry: ValidationState;
  cvc: ValidationState;
  name: ValidationState;
};

export type CreditCardFormData = {
  valid: boolean;
  values: CreditCardFormValues;
  status: CreditCardFormState;
};

export type CreditCardFormErrors = {
  number?: ValidationState;
  expiry?: ValidationState;
  cvc?: ValidationState;
  name?: ValidationState;
};

// --- Utilities

const toStatus = (validation: {
  isValid: boolean;
  isPotentiallyValid: boolean;
}): ValidationState => {
  return validation.isValid
    ? 'valid'
    : validation.isPotentiallyValid
      ? 'incomplete'
      : 'invalid';
};

const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');

const limitLength = (string = '', maxLength: number) =>
  string.slice(0, maxLength);

const addGaps = (string = '', gaps: number[]) => {
  const offsets = [0].concat(gaps).concat([string.length]);

  return offsets
    .map((end, index) => {
      if (index === 0) return '';
      const start = offsets[index - 1] || 0;
      return string.slice(start, end);
    })
    .filter((part) => part !== '')
    .join(' ');
};

const formatCardNumber = (
  number: string,
  maxLength: number,
  gaps: number[]
) => {
  const numberSanitized = removeNonNumber(number);
  const lengthSanitized = limitLength(numberSanitized, maxLength);
  const formatted = addGaps(lengthSanitized, gaps);
  return formatted;
};

const formatCardExpiry = (expiry: string) => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
  }
  return sanitized;
};

const formatCardCVC = (cvc: string, cvcMaxLength: number) => {
  return limitLength(removeNonNumber(cvc), cvcMaxLength);
};

export const useCreditCardForm = (
  onChange: (formData: CreditCardFormData) => void,
  requiresName: boolean = true
) => {
  const [formState, setFormState] = useState<CreditCardFormState>({
    number: 'incomplete',
    expiry: 'incomplete',
    cvc: 'incomplete',
    name: 'incomplete',
  });

  const [values, setValues] = useState<CreditCardFormValues>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    type: undefined,
  });

  const [errors, setErrors] = useState<CreditCardFormErrors>({});

  const validateAll = useCallback(() => {
    const numberValidation = cardValidator.number(values.number);
    // @ts-ignore
    const nameValidation = requiresName ? values.name.trim().length > 0 : true;

    const cvcMaxLength = numberValidation.card?.code.size || 3;
    const cardNumberGaps = numberValidation.card?.gaps || [4, 8, 12];
    const cardNumberMaxLength = Math.max(
      ...(numberValidation.card?.lengths || [16])
    );

    const newFormattedValues = {
      number: formatCardNumber(
        values.number,
        cardNumberMaxLength,
        cardNumberGaps
      ),
      expiry: formatCardExpiry(values.expiry),
      cvc: formatCardCVC(values.cvc, cvcMaxLength),
      name: values.name,
      type: numberValidation.card?.type as CreditCardIssuer,
    };

    const newFormState: CreditCardFormState = {
      number: toStatus(
        cardValidator.number(removeNonNumber(newFormattedValues.number))
      ),
      expiry: toStatus(cardValidator.expirationDate(newFormattedValues.expiry)),
      cvc: toStatus(cardValidator.cvv(newFormattedValues.cvc, cvcMaxLength)),
      name: nameValidation ? 'valid' : 'invalid',
    };

    const newErrors: CreditCardFormErrors = {
      number: newFormState.number === 'invalid' ? 'invalid' : undefined,
      expiry: newFormState.expiry === 'invalid' ? 'invalid' : undefined,
      cvc: newFormState.cvc === 'invalid' ? 'invalid' : undefined,
      name: newFormState.name === 'invalid' ? 'invalid' : undefined,
    };

    setErrors(newErrors);
    setValues(newFormattedValues);
    setFormState(newFormState);

    onChange({
      valid:
        newFormState.number === 'valid' &&
        newFormState.expiry === 'valid' &&
        newFormState.cvc === 'valid' &&
        newFormState.name === 'valid',
      values: newFormattedValues,
      status: newFormState,
    });
  }, [values, onChange, requiresName]);

  const onChangeValue = useCallback(
    (field: CreditCardFormField, value: string) => {
      const newValues = {
        ...values,
        [field]: value,
      };

      let numberValidation = cardValidator.number(newValues.number);
      // @ts-ignore
      const nameValidation = requiresName
        ? newValues.name.trim().length > 0
        : true;
      const cvcMaxLength = numberValidation.card?.code.size || 3;
      const cardNumberGaps = numberValidation.card?.gaps || [4, 8, 12];
      const cardNumberMaxLength = Math.max(
        ...(numberValidation.card?.lengths || [16])
      );

      const newFormattedValues = {
        number: formatCardNumber(
          newValues.number,
          cardNumberMaxLength,
          cardNumberGaps
        ),
        expiry: formatCardExpiry(newValues.expiry),
        cvc: formatCardCVC(newValues.cvc, cvcMaxLength),
        name: newValues.name,
        type: numberValidation.card?.type as CreditCardIssuer,
      };

      const newFormState: CreditCardFormState = {
        number: toStatus(
          cardValidator.number(removeNonNumber(newFormattedValues.number))
        ),
        expiry: toStatus(
          cardValidator.expirationDate(newFormattedValues.expiry)
        ),
        cvc: toStatus(cardValidator.cvv(newFormattedValues.cvc, cvcMaxLength)),
        name: nameValidation ? 'valid' : 'invalid',
      };

      const newErrors: CreditCardFormErrors = {
        number: newFormState.number === 'invalid' ? 'invalid' : undefined,
        expiry: newFormState.expiry === 'invalid' ? 'invalid' : undefined,
        cvc: newFormState.cvc === 'invalid' ? 'invalid' : undefined,
        name: newFormState.name === 'invalid' ? 'invalid' : undefined,
      };

      setErrors(newErrors);
      setValues(newFormattedValues);
      setFormState(newFormState);

      onChange({
        valid:
          newFormState.number === 'valid' &&
          newFormState.expiry === 'valid' &&
          newFormState.cvc === 'valid' &&
          newFormState.name === 'valid',
        values: newFormattedValues,
        status: newFormState,
      });
    },
    [values, onChange, requiresName]
  );

  return {
    validateAll,
    values,
    status: formState,
    errors,
    onChangeValue,
  };
};
