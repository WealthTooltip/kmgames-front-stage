import dayjs from 'dayjs';
// 今日
export const todayRange = () => {
  const start = dayjs().startOf('day').valueOf();
  const end = dayjs().endOf('day').valueOf();
  return [start, end];
};
// 昨日
export const yeastodayRange = () => {
  const start = dayjs().subtract(1, 'days').startOf('day').valueOf();
  const end = dayjs().subtract(1, 'days').endOf('day').valueOf();
  return [start, end];
};
// 一周
export const weekRange = () => {
  const start = dayjs().startOf('week').valueOf();
  const end = dayjs().endOf('week').valueOf();
  return [start, end];
};
// 一周
export const pastWeekRange = () => {
  const start = dayjs().subtract(7, 'days').startOf('day').valueOf();
  const end = dayjs().endOf('day').valueOf();
  return [start, end];
};
// 一月
export const monthRange = () => {
  const start = dayjs().subtract(1, 'month').startOf('day').valueOf();
  const end = dayjs().endOf('day').valueOf();
  return [start, end];
};
// 24小时内
export const today24 = () => {
  const start = dayjs().subtract(24, 'hour').valueOf();
  const end = dayjs().valueOf();
  return [start, end];
};
export const YYYYMMDDHHmmss = (temptime:string | number, template?: string)=>{
  let format = 'YYYY-MM-DD HH:mm:ss';
  if (template) format = template;
  return dayjs(temptime).format(format);
};
export const assignDateSearch = (date: EAssignDate)=> {
  switch (date) {
    case 'today':
      return todayRange();
    case 'yeastoday':
      return yeastodayRange();
    case 'week':
      return weekRange();
    case 'pastWeek':
      return pastWeekRange();
    case 'month':
      return monthRange();
    case 'today24':
      return today24();
  }
  return todayRange();
};

type EAssignDate = 'today' | 'yeastoday' | 'week' | 'pastWeek' | 'month' | 'today24';
