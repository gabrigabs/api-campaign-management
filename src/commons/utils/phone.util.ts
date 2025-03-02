/* eslint-disable */

import { HttpException, HttpStatus } from "@nestjs/common";

export const getPhonesFromFile = (file: Express.Multer.File): string[] => {

  const fileContent = file.buffer.toString('utf-8');

  const phoneList =  fileContent.split('\n').map((line) => line.trim()).filter((line) => line !== '');

  phoneList.forEach((phone) => {
    if (!isValidPhone(phone)) {
      throw new HttpException(`All phones in files must be in the format XX XXXXX-XXXX`, HttpStatus.BAD_REQUEST);
    }
  })

  return phoneList;

};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{2}\s\d{5}-\d{4}$/;
  return phoneRegex.test(phone);
};
