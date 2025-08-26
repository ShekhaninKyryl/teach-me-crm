import type { AvailabilityList } from 'components/availability-table/types';

/*
Concat two time ranges if they are adjacent or overlapping

E.g. "12:00-14:00" and "14:00-16:00" => "12:00-16:00"
E.g. "12:00-14:00" and "13:00-15:00" => "12:00-15:00"
E.g. "12:00-14:00" and "15:00-16:00" => "12:00-14:00", "15:00-16:00"
 */
const concatTimeRanges = (range1: string, range2: string): string[] => {
  const [start1, end1] = range1.split('-');
  const [start2, end2] = range2.split('-');
  if (end1 >= start2 && start1 <= end2) {
    // Overlapping or adjacent ranges
    const newStart = start1 < start2 ? start1 : start2;
    const newEnd = end1 > end2 ? end1 : end2;
    return [`${newStart}-${newEnd}`];
  } else {
    // Non-overlapping ranges
    return [range1, range2];
  }
};

/*
Split time range into multiple ranges if the new time is in the middle of an existing range

E.g. "12:00-16:00" and "14:00" => "12:00-14:00", "15:00-16:00"
E.g. "12:00-16:00" and "12:00" => "13:00-16:00"
E.g. "12:00-16:00" and "16:00" => "12:00-15:00"
E.g. "12:00-16:00" and "10:00" => "10:00-11:00", "12:00-16:00"
E.g. "12:00-16:00" and "18:00" => "12:00-16:00", "18:00-19:00"
 */
const splitTimeRange = (range: string, time: string, step: number): string[] => {
  const [start, end] = range.split('-');
  if (time > start && time < end) {
    const newEnd = getTime(
      Math.max(
        0,
        Math.floor((parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])) / step)
      ),
      step
    );
    const newStart = getTime(
      Math.min(
        1440 / step,
        Math.floor((parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])) / step) + 1
      ),
      step
    );
    return [`${start}-${newEnd}`, `${newStart}-${end}`];
  } else if (time === start) {
    const newStart = getTime(
      Math.min(
        1440 / step - 1,
        Math.floor((parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])) / step) + 1
      ),
      step
    );
    return [`${newStart}-${end}`];
  } else if (time === end) {
    const newEnd = getTime(
      Math.max(
        0,
        Math.floor((parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])) / step) - 1
      ),
      step
    );
    return [`${start}-${newEnd}`];
  } else {
    return [range];
  }
};

/*
Collapse time ranges if they are adjacent or overlapping

E.g. ["Mon 12:00-14:00", "Mon 14:00-16:00"] => ["Mon 12:00-16:00"]
E.g. ["Mon 12:00-14:00", "Mon 15:00-16:00"] => ["Mon 12:00-14:00", "Mon 15:00-16:00"]
E.g. ["Mon 12:00-14:00", "Tue 14:00-16:00"] => ["Mon 12:00-14:00", "Tue 14:00-16:00"]
E.g. ["Mon 12:00-16:00", "Mon 13:00-15:00"] => ["Mon 12:00-16:00"]
E.g. ["Mon 12:00-16:00", "Mon 15:00-18:00"] => ["Mon 12:00-18:00"]
E.g. ["Mon 12:00-16:00", "Tue 12:00-16:00"] => ["Mon 12:00-16:00", "Tue 12:00-16:00"]
 */
const collapseTimeRanges = (availability: AvailabilityList): AvailabilityList => {
  const result: AvailabilityList = [];
  const groupedByDay: { [key: string]: string[] } = {};
  // Group ranges by day
  for (const slot of availability) {
    const [day, range] = slot.split(' ');
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    groupedByDay[day].push(range);
  }
  // Collapse ranges for each day
  for (const day in groupedByDay) {
    const ranges = groupedByDay[day];
    ranges.sort(); // Sort ranges to ensure proper merging
    const collapsed: string[] = [];
    for (const range of ranges) {
      if (collapsed.length === 0) {
        collapsed.push(range);
      } else {
        const lastRange = collapsed[collapsed.length - 1];
        const newRanges = concatTimeRanges(lastRange, range);
        if (newRanges.length === 1) {
          // Merged into one range
          collapsed[collapsed.length - 1] = newRanges[0];
        } else {
          collapsed.push(range);
        }
      }
    }
    for (const range of collapsed) {
      result.push(`${day} ${range}`);
    }
  }

  // Remove empty ranges like "12:00-12:00"
  return result.filter((r) => {
    const [_, range] = r.split(' ');
    const [start, end] = range.split('-');
    return start !== end;
  });
};

export const getTime = (slotIndex: number, step = 60) => {
  const totalMinutes = slotIndex * step; // Кількість хвилин з початку доби
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getTimeLabel = (day: string, time: string, value: AvailabilityList) => {
  const filteredByDay = value.filter((slot) => slot.startsWith(day));

  for (const slot of filteredByDay) {
    const [_, range] = slot.split(' ');
    const [start] = range.split('-');
    if (time === start) {
      return range;
    }
  }
  return undefined;
};

export const isSelected = (day: string, time: string, value: AvailabilityList): boolean => {
  const filteredByDay = value.filter((slot) => slot.startsWith(day));

  for (const slot of filteredByDay) {
    const [_, range] = slot.split(' ');
    const [start, end] = range.split('-');
    if (time >= start && time < end) {
      return true;
    }
  }
  return false;
};

export const changeAvailability = (
  day: string,
  time: string,
  current: AvailabilityList,
  step: number
): AvailabilityList => {
  let updated = [...current];
  const filteredByDay = updated.filter((slot) => slot.startsWith(day));

  if (isSelected(day, time, filteredByDay)) {
    // Remove the time from the existing slot
    const slotToUpdate = filteredByDay.find((slot) => {
      const [_, range] = slot.split(' ');
      const [start, end] = range.split('-');
      return time >= start && time < end;
    });
    if (slotToUpdate) {
      const [dayPart, rangePart] = slotToUpdate.split(' ');
      const newRanges = splitTimeRange(rangePart, time, step);
      updated = updated.filter((slot) => slot !== slotToUpdate);
      newRanges.forEach((newRange) => {
        if (newRange) {
          updated.push(`${dayPart} ${newRange}`);
        }
      });
    }
  } else {
    // Add a new slot
    const endTime = getTime(
      Math.min(
        1440 / step,
        Math.floor((parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])) / step) + 1
      ),
      step
    );
    const newSlot = `${day} ${time}-${endTime}`;

    // Try to concatenate with existing slots
    let concatenated = false;
    for (const slot of filteredByDay) {
      const [_, range] = slot.split(' ');
      const newRanges = concatTimeRanges(range, `${time}-${endTime}`);
      if (newRanges.length === 1) {
        // Successfully concatenated
        updated = updated.filter((s) => s !== slot && s !== newSlot);
        updated.push(`${day} ${newRanges[0]}`);
        concatenated = true;
        break;
      }
    }
    if (!concatenated) {
      updated.push(newSlot);
    }
  }

  return collapseTimeRanges(updated);
};

export const changeDayAvailability = (
  day: string,
  current: AvailabilityList,
  step: number
): AvailabilityList => {
  let updated = [...current];
  const filteredByDay = updated.filter((slot) => slot.startsWith(day));
  if (filteredByDay.length > 0) {
    // Deselect all slots in the day
    updated = updated.filter((slot) => !slot.startsWith(day));
  } else {
    // Add all slots in the day
    updated.push(`${day} 00:00-${getTime(1440 / step, step)}`);
  }

  return collapseTimeRanges(updated);
};
