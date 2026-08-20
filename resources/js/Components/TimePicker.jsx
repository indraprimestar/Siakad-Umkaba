import { useState } from 'react';

export default function TimePicker({ value = '07:00', onChange }) {
    const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 7);
    const [selectedMinute, setSelectedMinute] = useState(value ? value.split(':')[1] : '00');

    const hours = Array.from({ length: 11 }, (_, i) => 7 + i); // 7 sampai 17
    const minutes = ['00', '15', '30', '45'];

    const handleHourChange = (hour) => {
        setSelectedHour(hour);
        const newTime = `${String(hour).padStart(2, '0')}:${selectedMinute}`;
        onChange(newTime);
    };

    const handleMinuteChange = (minute) => {
        setSelectedMinute(minute);
        const newTime = `${String(selectedHour).padStart(2, '0')}:${minute}`;
        onChange(newTime);
    };

    return (
        <div className="flex gap-3">
            {/* Kolom Jam */}
            <div className="flex-1">
                <select
                    value={selectedHour}
                    onChange={(e) => handleHourChange(parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {String(hour).padStart(2, '0')} ({hour >= 12 ? 'Sore' : 'Pagi'})
                        </option>
                    ))}
                </select>
            </div>

            {/* Separator */}
            <div className="flex items-center text-xl font-semibold text-gray-400">:</div>

            {/* Kolom Menit */}
            <div className="flex-1">
                <select
                    value={selectedMinute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                    {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
