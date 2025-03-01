import { PaginatedQueryDto } from '@commons/dtos/paginated-query.dto';

export const mountPaginateAndSearchParams = <T extends PaginatedQueryDto>(
  params: T,
) => {
  const { page = 1, limit = 10, ...where } = params;

  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    where,
  };
};

export const mountPaginatedResponse = <T>(
  query: PaginatedQueryDto,
  items: T[],
  total: number,
) => {
  const { page = 1, limit = 10 } = query;
  return {
    data: items,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
};
