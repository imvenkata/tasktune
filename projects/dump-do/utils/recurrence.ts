import { DAYS_OF_WEEK } from './dates';
import { Recurrence } from '../types';

export const shouldTaskAppearOnDate = (
  task: { date: string; recurrence?: Recurrence },
  dateStr: string
): boolean => {
  const taskDate = new Date(task.date);
  const checkDate = new Date(dateStr);

  if (checkDate < taskDate) return false;

  if (task.recurrence?.endDate && checkDate > new Date(task.recurrence.endDate)) {
    return false;
  }

  const recurrence = task.recurrence || { type: 'none' };

  switch (recurrence.type) {
    case 'none':
      return dateStr === task.date;

    case 'daily':
      return true;

    case 'weekdays':
      const dow = checkDate.getDay();
      return dow >= 1 && dow <= 5;

    case 'weekly':
    case 'custom':
      if (recurrence.days && recurrence.days.length > 0) {
        return recurrence.days.includes(checkDate.getDay());
      }
      return checkDate.getDay() === taskDate.getDay();

    default:
      return dateStr === task.date;
  }
};

export const getRecurrenceLabel = (recurrence?: Recurrence): string | null => {
  if (!recurrence || recurrence.type === 'none') return null;

  switch (recurrence.type) {
    case 'daily':
      return 'Every day';

    case 'weekdays':
      return 'Weekdays';

    case 'weekly':
    case 'custom':
      if (recurrence.days && recurrence.days.length > 0) {
        if (recurrence.days.length === 7) return 'Every day';
        return recurrence.days.map(d => DAYS_OF_WEEK[d].slice(0, 2)).join(', ');
      }
      return 'Weekly';

    default:
      return null;
  }
};
