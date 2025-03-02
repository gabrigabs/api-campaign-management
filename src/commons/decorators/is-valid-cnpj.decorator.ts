import { isValidCnpj } from '@commons/utils/document.util';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return isValidCnpj(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid CNPJ`;
        },
      },
    });
  };
}
