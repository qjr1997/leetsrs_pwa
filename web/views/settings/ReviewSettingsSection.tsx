import {
  useMaxNewCardsPerDayQuery,
  useSetMaxNewCardsPerDayMutation,
  useDayStartHourQuery,
  useSetDayStartHourMutation,
} from '../../hooks/useQueries';
import {
  DEFAULT_MAX_NEW_CARDS_PER_DAY,
  DEFAULT_DAY_START_HOUR,
} from '../../shared/settings';
import { useState, useEffect } from 'react';
import { useI18n } from '../../contexts/I18nContext';

const MIN_NEW_CARDS_PER_DAY = 0;
const MAX_NEW_CARDS_PER_DAY = 100;
const MIN_DAY_START_HOUR = 0;
const MAX_DAY_START_HOUR = 23;

export function ReviewSettingsSection() {
  const t = useI18n();
  const { data: maxNewCardsPerDay } = useMaxNewCardsPerDayQuery();
  const setMaxNewCardsPerDayMutation = useSetMaxNewCardsPerDayMutation();
  const [inputValue, setInputValue] = useState('');
  const { data: dayStartHour } = useDayStartHourQuery();
  const setDayStartHourMutation = useSetDayStartHourMutation();
  const [dayStartHourValue, setDayStartHourValue] = useState('');

  useEffect(() => {
    if (maxNewCardsPerDay !== undefined) {
      setInputValue(maxNewCardsPerDay.toString());
    }
  }, [maxNewCardsPerDay]);

  useEffect(() => {
    if (dayStartHour !== undefined) {
      setDayStartHourValue(dayStartHour.toString());
    }
  }, [dayStartHour]);

  const handleBlur = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value >= MIN_NEW_CARDS_PER_DAY && value <= MAX_NEW_CARDS_PER_DAY) {
      setMaxNewCardsPerDayMutation.mutate(value);
    } else {
      setInputValue((maxNewCardsPerDay ?? DEFAULT_MAX_NEW_CARDS_PER_DAY).toString());
    }
  };

  const handleDayStartBlur = () => {
    const value = parseInt(dayStartHourValue, 10);
    if (!isNaN(value) && value >= MIN_DAY_START_HOUR && value <= MAX_DAY_START_HOUR) {
      setDayStartHourMutation.mutate(value);
    } else {
      setDayStartHourValue((dayStartHour ?? DEFAULT_DAY_START_HOUR).toString());
    }
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.settings.reviewSettings.title}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label>{t.settings.reviewSettings.newCardsPerDay}</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            min={MIN_NEW_CARDS_PER_DAY.toString()}
            max={MAX_NEW_CARDS_PER_DAY.toString()}
            placeholder={DEFAULT_MAX_NEW_CARDS_PER_DAY.toString()}
            className="w-20 px-2 py-1 rounded border bg-primary text-primary border-theme text-right"
          />
        </div>
        <div className="flex items-center justify-between">
          <label>{t.settings.reviewSettings.dayStartHour}</label>
          <input
            type="number"
            value={dayStartHourValue}
            onChange={(e) => setDayStartHourValue(e.target.value)}
            onBlur={handleDayStartBlur}
            min={MIN_DAY_START_HOUR.toString()}
            max={MAX_DAY_START_HOUR.toString()}
            step="1"
            placeholder={DEFAULT_DAY_START_HOUR.toString()}
            className="w-20 px-2 py-1 rounded border bg-primary text-primary border-theme text-right"
          />
        </div>
      </div>
    </div>
  );
}
