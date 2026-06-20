import { useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

export default function DynamicStringList({
  label,
  items = [],
  onChange,
  placeholder = '',
  addButtonText = '+ ADD NEW ITEM'
}) {
  const inputsRef = useRef([]);

  const handleTextChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAdd = () => {
    const updated = [...items, ''];
    onChange(updated);
  };

  // Focus the last input when a new empty item is appended
  useEffect(() => {
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      const lastInput = inputsRef.current[lastIndex];
      if (lastInput && lastInput.value === '') {
        lastInput.focus();
      }
    }
  }, [items.length]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 animate-fade-in">
            <input
              type="text"
              ref={(el) => (inputsRef.current[index] = el)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              placeholder={placeholder}
              value={item}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              title="Remove item"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:text-aag-primary hover:border-aag-primary hover:bg-gray-50/50 transition-all cursor-pointer"
      >
        <Plus size={14} />
        {addButtonText}
      </button>
    </div>
  );
}

DynamicStringList.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  addButtonText: PropTypes.string
};
