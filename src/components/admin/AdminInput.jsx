export default function AdminInput({ label, value, onChange, type = 'text', isTextarea, darkMode, ...props }) {
  const Component = isTextarea ? 'textarea' : 'input'
  
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">
        {label}
      </label>
      <Component 
        type={type} 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        className={`w-full ${
          darkMode 
            ? 'bg-slate-800 border-slate-700 text-white' 
            : 'bg-slate-50 border-slate-200 text-slate-900'
        } border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
          isTextarea ? 'h-24 resize-none' : ''
        }`}
        {...props}
      />
    </div>
  )
}