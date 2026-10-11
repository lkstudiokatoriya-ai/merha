import React, { useState, useEffect } from 'react';
import { useVillage } from '../context/VillageContext';

interface EditableTextProps {
  value: string;
  onChange: (newVal: string) => void;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Tag = 'span',
  multiline = false,
  className = '',
  style,
}) => {
  const { isInlineEditMode } = useVillage();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  if (!isInlineEditMode) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  if (multiline) {
    return (
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          onChange(e.target.value);
        }}
        rows={Math.max(2, Math.min(6, Math.ceil((draft?.length || 40) / 65)))}
        onClick={(e) => e.stopPropagation()}
        style={style}
        className={`w-full rounded-lg border border-dashed border-amber-400/80 bg-amber-500/10 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-amber-500/20 transition-all ${className}`}
        title="Click to edit text inline"
      />
    );
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(e.target.value);
      }}
      onClick={(e) => e.stopPropagation()}
      style={style}
      className={`w-full rounded-lg border border-dashed border-amber-400/80 bg-amber-500/10 px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-amber-500/20 transition-all ${className}`}
      title="Click to edit text inline"
    />
  );
};
