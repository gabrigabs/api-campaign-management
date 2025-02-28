import { CurrentUserDto } from '@commons/dtos/current-user.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: CurrentUserDto }>();
  const user = request.user;

  return user;
});
