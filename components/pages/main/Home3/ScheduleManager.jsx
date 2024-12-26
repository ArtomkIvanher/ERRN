import React, { useEffect, useState } from 'react';

export default function ScheduleManager({ schedule, setSchedule, subjects }) {
  const [initialized, setInitialized] = useState(false);
  const [showRepeatMenu, setShowRepeatMenu] = useState(false);

  const daysOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П’ятниця',
    'Субота',
    'Неділя',
  ];

  useEffect(() => {
    if (!initialized && schedule?.repeat) {
      const updatedSchedule = { ...schedule };
      let needsUpdate = false;

      updatedSchedule.schedule = updatedSchedule.schedule.map((day) => {
        const updatedDay = {};
        for (let i = 1; i <= 4; i++) {
          if (!day[`week${i}`]) {
            updatedDay[`week${i}`] = [0];
            needsUpdate = true; // Add missing weeks
          } else {
            updatedDay[`week${i}`] = day[`week${i}`];
          }
        }
        return updatedDay;
      });

      if (needsUpdate) {
        setSchedule(updatedSchedule);
      }
      setInitialized(true);
    }
  }, [schedule, setSchedule, initialized]);

  const handleSubjectChange = (dayIndex, weekPart, subjectIndex, newSubjectId) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule.schedule[dayIndex][weekPart][subjectIndex] = newSubjectId;
    setSchedule(updatedSchedule);
  };

  const handleRepeatChange = (newRepeat) => {
    if (newRepeat < 1 || newRepeat > 4 || newRepeat === schedule.repeat) {
      setShowRepeatMenu(false);
      return;
    }

    const updatedSchedule = { ...schedule, repeat: newRepeat };
    setSchedule(updatedSchedule);
    setShowRepeatMenu(false);
  };

  const handleAddDefaultSubject = (dayIndex, weekPart) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule.schedule[dayIndex][weekPart] = [
      ...updatedSchedule.schedule[dayIndex][weekPart],
      0, // Add a new subject with ID 0
    ];
    setSchedule(updatedSchedule);
  };

  const handleRemoveSubject = (dayIndex, weekPart, subjectIndex) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule.schedule[dayIndex][weekPart] = updatedSchedule.schedule[dayIndex][weekPart].filter(
      (_, index) => index !== subjectIndex
    );
    setSchedule(updatedSchedule);
  };

  if (!schedule || !schedule.schedule) {
    return <div>Loading schedule...</div>;
  }

  if (!Array.isArray(schedule.schedule)) {
    return <div>Invalid schedule data</div>;
  }

  return (
    <div>
      <h3>Розклад по днях</h3>

      <div>
        <label>Кількість тижнів повторення:</label>
        <button onClick={() => setShowRepeatMenu((prev) => !prev)}>
          Змінити кількість тижнів
        </button>
        <span>Зараз вибрано: {schedule.repeat} тижні(нь)</span>
        {showRepeatMenu && (
          <div>
            {[1, 2, 3, 4].map((value) => (
              <button key={value} onClick={() => handleRepeatChange(value)}>
                {value} тижні(нь)
              </button>
            ))}
          </div>
        )}
      </div>

      {schedule.schedule.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h4>{daysOfWeek[dayIndex]}</h4>
          {Object.keys(day)
            .sort((a, b) => parseInt(a.replace('week', '')) - parseInt(b.replace('week', '')))
            .slice(0, schedule.repeat)
            .map((weekPart) => (
              <div key={weekPart}>
                <h5>{weekPart}</h5>
                <button onClick={() => handleAddDefaultSubject(dayIndex, weekPart)}>
                  Додати пару
                </button>
                {day[weekPart].map((subjectId, subjectIndex) => (
                  <div key={subjectIndex}>
                    <select
                      value={subjectId}
                      onChange={(e) =>
                        handleSubjectChange(
                          dayIndex,
                          weekPart,
                          subjectIndex,
                          Number(e.target.value)
                        )
                      }
                    >
                      <option value={0}>Без предмета</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveSubject(dayIndex, weekPart, subjectIndex)}
                    >
                      Видалити пару
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
