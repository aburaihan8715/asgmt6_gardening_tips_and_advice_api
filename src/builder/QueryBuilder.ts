import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public queryObj: Record<string, unknown>;

  constructor(
    modelQuery: Query<T[], T>,
    queryObj: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.queryObj = queryObj;
  }

  search(searchAbleFields: string[] = []) {
    if (this.queryObj.searchTerm && searchAbleFields.length > 0) {
      const searchTermValue = this.queryObj.searchTerm;
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: searchTermValue, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    if (typeof this.queryObj !== 'object' || !this.queryObj) {
      return this;
    }

    let filterObj = { ...this.queryObj };
    const excludeFields = [
      'searchTerm',
      'page',
      'limit',
      'fields',
      'sort',
    ];
    excludeFields.forEach((item) => delete filterObj[item]);

    const filterObjString = JSON.stringify(filterObj).replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`,
    );

    filterObj = JSON.parse(filterObjString);
    this.modelQuery = this.modelQuery.find(filterObj);

    return this;
  }

  sort() {
    const sortValue =
      typeof this.queryObj.sort === 'string'
        ? this.queryObj.sort.split(',').join(' ')
        : '-createdAt';

    this.modelQuery = this.modelQuery.sort(sortValue);
    return this;
  }

  fields() {
    const fieldsValue =
      typeof this.queryObj.fields === 'string'
        ? this.queryObj.fields.split(',').join(' ')
        : '-__v';

    this.modelQuery = this.modelQuery.select(fieldsValue);
    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this.queryObj.page) || 1);
    const limit = Math.max(1, Number(this.queryObj.limit) || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async calculatePaginate() {
    const page = Math.max(1, Number(this.queryObj.page) || 1);
    const limit = Math.max(1, Number(this.queryObj.limit) || 10);

    const finalFilter = this.modelQuery.getQuery();
    const totalDocs =
      await this.modelQuery.model.countDocuments(finalFilter);
    const totalPage = Math.ceil(totalDocs / limit);

    return { page, limit, totalDocs, totalPage };
  }
}

export default QueryBuilder;
