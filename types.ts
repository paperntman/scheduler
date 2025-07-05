export enum ScheduleItemType {
  SCHEDULE = 'SCHEDULE',
  POINT = 'POINT',
}

interface BaseScheduleItem {
  id: string;
  title: string;
  color: string;
}

export interface Schedule extends BaseScheduleItem {
  type: ScheduleItemType.SCHEDULE;
  startTime: string;
  endTime:string;
}

export interface PointEvent extends BaseScheduleItem {
  type: ScheduleItemType.POINT;
  time: string;
}

export type ScheduleItem = Schedule | PointEvent;

export type ScheduleItemData = Omit<Schedule, 'id' | 'color'> | Omit<PointEvent, 'id' | 'color'>;

export type ScheduleItemSubmit = ScheduleItemData | ScheduleItem;