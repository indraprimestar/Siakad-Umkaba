import { cn } from '@/lib/utils';
import { useRef } from 'react';

export default function CalendarSchedules({
    days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    schedules = {},
    student = null,
}) {
    const container = useRef(null);
    const containerNav = useRef(null);

    // Generate time labels dari 07:00 - 17:00
    const timeLabels = [];
    for (let i = 7; i <= 17; i++) {
        timeLabels.push(`${String(i).padStart(2, '0')}:00`);
    }

    // Convert time string (HH:mm) to minutes since 07:00
    const getMinutesSince7AM = (timeStr) => {
        const [hour, minute] = timeStr.split(':').map(Number);
        return (hour - 7) * 60 + minute;
    };

    // Calculate duration in minutes
    const getDurationMinutes = (startTime, endTime) => {
        const startMinutes = getMinutesSince7AM(startTime);
        const endMinutes = getMinutesSince7AM(endTime);
        return Math.max(endMinutes - startMinutes, 60);
    };

    const calculateColumnIndex = (day) => {
        return days.indexOf(day);
    };

    const colorMap = {};
    const getColorForSchedule = (key) => {
        if (!colorMap[key]) {
            const colors = [
                'bg-red-500',
                'bg-blue-500',
                'bg-green-500',
                'bg-orange-500',
                'bg-yellow-500',
                'bg-emerald-500',
                'bg-sky-500',
                'bg-purple-500',
                'bg-pink-500',
                'bg-indigo-500',
            ];
            colorMap[key] = colors[Object.keys(colorMap).length % colors.length];
        }
        return colorMap[key];
    };

    const cellHeight = 80; // Height of each hour cell in pixels
    const hourHeight = cellHeight;

    return (
        <div ref={container} className="h-full w-full overflow-auto bg-white">
            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex">
                    {/* Time column header */}
                    <div className="flex h-16 w-20 flex-shrink-0 items-center justify-end border-r border-gray-200 bg-gray-50 pr-2">
                        <span className="text-xs font-semibold text-gray-700">Jam</span>
                    </div>

                    {/* Days header */}
                    <div className="flex flex-1">
                        {days.map((day, idx) => (
                            <div
                                key={idx}
                                className="flex h-16 min-w-[150px] flex-1 items-center justify-center border-r border-gray-200 text-sm font-semibold text-gray-900"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="relative flex">
                {/* Time column */}
                <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                    {timeLabels.map((time, idx) => (
                        <div
                            key={idx}
                            className="flex h-20 items-center justify-end border-b border-gray-200 pr-2 text-xs font-medium text-gray-700"
                            style={{ height: hourHeight }}
                        >
                            {time}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="relative flex flex-1">
                    {days.map((day, dayIdx) => (
                        <div key={dayIdx} className="relative min-w-[150px] flex-1 border-r border-gray-200">
                            {/* Hour grid lines */}
                            {timeLabels.map((time, hourIdx) => (
                                <div
                                    key={hourIdx}
                                    className="border-b border-gray-200"
                                    style={{ height: hourHeight }}
                                ></div>
                            ))}

                            {/* Schedule blocks for this day */}
                            {Object.entries(schedules).map(([startTime, daySchedules]) => {
                                if (!daySchedules[day]) return null;

                                const schedule = daySchedules[day];
                                const startMinutes = getMinutesSince7AM(startTime);
                                const durationMinutes = getDurationMinutes(startTime, schedule.end_time);
                                const color = getColorForSchedule(`${startTime}-${day}`);

                                const topOffset = (startMinutes / 60) * hourHeight;
                                const blockHeight = (durationMinutes / 60) * hourHeight;

                                return (
                                    <div
                                        key={`${startTime}-${day}`}
                                        className={cn(
                                            'absolute left-1 right-1 cursor-pointer overflow-hidden rounded-lg p-2 text-white shadow-md transition-all hover:shadow-lg',
                                            color,
                                        )}
                                        style={{
                                            top: `${topOffset}px`,
                                            height: `${blockHeight}px`,
                                            zIndex: 10,
                                        }}
                                    >
                                        <p className="text-xs font-semibold leading-tight">
                                            {startTime} - {schedule.end_time}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-xs font-medium">{schedule.course}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
