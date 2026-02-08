import React, { useState, useEffect } from 'react';

const ManualTimeInput = ({ label, value, onChange, onBlur, error, helperText }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        // Sync with parent value if formatted
        if (value) {
            // We might want to keep what user is typing or sync only when valid?
            // Simpler: Format value for display if it matches strict format, otherwise keep input
            // But since we want "Keep what user typed OR display normalized", let's keep it controlled unless strict
            setInputValue(value);
        }
    }, [value]);

    const parseTime = (input) => {
        if (!input) return null;
        input = input.trim();

        // formats: HH:mm (24h), hh:mm AM/PM, h:mm AM/PM
        // Regex for 24h
        const time24 = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        // Regex for 12h
        const time12 = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM|am|pm)$/i;

        // Try 24h
        let match = input.match(time24);
        if (match) {
            let h = parseInt(match[1]);
            let m = match[2];
            // Format to HH:mm
            return `${h.toString().padStart(2, '0')}:${m}`;
        }

        // Try 12h
        match = input.match(time12);
        if (match) {
            let h = parseInt(match[1]);
            let m = match[2];
            let ampm = match[3].toUpperCase();

            if (ampm === 'PM' && h < 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;

            return `${h.toString().padStart(2, '0')}:${m}`;
        }

        return null;
    };

    const handleBlur = (e) => {
        const parsed = parseTime(inputValue);
        if (inputValue && !parsed) {
            setLocalError('Invalid time format (e.g. 06:00 PM or 18:00)');
            if (onBlur) onBlur(e, null); // Notify parent of invalid state if needed
        } else {
            setLocalError('');
            if (parsed) {
                // Determine if we should show AM/PM or 24h back to user?
                // Requirement: "Display a normalized nice format (choose one consistent approach)"
                // Let's standardize on AM/PM for display if user typed AM/PM, or 24h if user typed 24h?
                // Actually, let's look at requirements: "Store as HH:mm 24-hour".
                // "On UI display, keep what user typed OR display a normalized nice format".
                // I will normalize to HH:mm (24h) for consistency with backend, OR nicer 12h.
                // Converting back to 12h might be friendlier?
                // Let's stick to converting to 24h string for state, and maybe display that.

                // Let's actually update value to the Normalized string
                onChange(parsed); // Send HH:mm to parent
                setInputValue(parsed); // Update input to formatted
            }
        }
        if (onBlur) onBlur(e);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setLocalError(''); // Clear error while typing
    };

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="06:00 PM"
                className={`w-full px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 transition-all
                    ${error || localError
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'}`}
            />
            {(helperText && !error && !localError) && (
                <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            )}
            {(error || localError) && (
                <p className="text-xs text-red-500 mt-1">{error || localError}</p>
            )}
        </div>
    );
};

export default ManualTimeInput;
