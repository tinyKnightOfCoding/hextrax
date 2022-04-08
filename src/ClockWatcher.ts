export interface ClockWatcher {

    newHour: () => void;
    newDay: () => void;
    newWeek: () => void;
}
