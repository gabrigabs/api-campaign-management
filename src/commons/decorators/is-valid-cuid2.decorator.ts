import { isCuid } from '@paralleldrive/cuid2';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidCuid2(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidCuid2',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isCuid(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid cuid2`;
        },
      },
    });
  };
}
