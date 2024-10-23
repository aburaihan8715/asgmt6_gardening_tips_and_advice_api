const date = new Date();
const currentMonth = date.getMonth() + 1; // 1 = January, 12 = December
const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
console.log(previousMonth); // Output: previous month (1-based)
