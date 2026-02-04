import { Trash2 } from 'lucide-react'

export default function AdminCard({ title, children, darkMode, onDelete }) {
  return (
    <div className={`${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} backdrop-blur-xl border rounded-2xl p-6 relative`}>
      {onDelete && (
        <button 
          onClick={onDelete} 
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      )}
      {title && (
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}