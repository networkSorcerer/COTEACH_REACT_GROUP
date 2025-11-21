import React, {useRef} from 'react'
import './MoodPicker.style.css';

const MoodPicker = ({ value, onChange, options = []}) => {
  const groupRef = useRef(null);

  const onKeyDown = (event) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) {
      return;
    }
    event.preventDefault();

    const index = options.findIndex((option) => option.key === value);
    if (index === -1) {
      return;
    }
    const next = event.key === 'ArrowRight' ? options[(index + 1) % options.length] : options[(index - 1 + options.length) % options.length];
    onChange(next.key);
  }
  return (
    <div
        ref={groupRef}
        role="radiogroup"
        aria-label="오늘의 감정"
        className="mood-grid"
        onKeyDown={onKeyDown}
    >
      {options.map(opt => {
        const selected = value === opt.key
        const style = selected && opt.colors ? {
          backgroundColor: opt.colors.cardBg,
          borderColor: opt.colors.cardBorder,
          color: opt.colors.text
        } : undefined
        return (
            <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                className={`mood-card ${selected ? 'selected' : ''}`}
                onClick={() => onChange(opt.key)}
                style={style}
                data-emoji={opt.emoji}
            >
              <span className="mood-label">{opt.label}</span>
            </button>
        )
      })}
    </div>
  )
}

export default MoodPicker
