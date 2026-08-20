export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' + className}
        />
    );
}

// export default function Checkbox({ className = '', onCheckedChange, ...props }) {
//   return (
//     <input
//       type="checkbox"
//       {...props}
//       onChange={(e) => onCheckedChange?.(e.target.checked)}  // <-- map ke onChange
//       className={'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 ' + className}
//     />
//   );
// }
