export const filterObj = (
  obj: Record<string, unknown>,
  ...allowedFields: string[]
) => {
  const newObj: Record<string, unknown> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
