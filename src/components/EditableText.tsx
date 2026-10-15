import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useVillage } from '../context/VillageContext';

interface EditableTextProps {
  value?: string;
  onChange?: (newVal: string) => void;
  labelKey?: string;
  defaultText?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'div';
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  labelKey,
  defaultText = '',
  as: Tag = 'span',
  multiline = false,
  placeholder = 'Removed (type here to restore or write new text)...',
  className = '',
  style,
}) => {
  const { isInlineEditMode, data, updateData } = useVillage();

  const resolvedValue =
    labelKey !== undefined
      ? data.uiLabels && labelKey in data.uiLabels
        ? data.uiLabels[labelKey]
        : defaultText
      : value ?? '';

  const [draft, setDraft] = useState(resolvedValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(resolvedValue);
  }, [resolvedValue]);

  useEffect(() => {
    if (isInlineEditMode && multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(
        40,
        textareaRef.current.scrollHeight
      )}px`;
    }
  }, [draft, isInlineEditMode, multiline]);

  const handleValueChange = (nextVal: string) => {
    setDraft(nextVal);
    if (labelKey !== undefined) {
      updateData({
        ...data,
        uiLabels: {
          ...(data.uiLabels || {}),
          [labelKey]: nextVal,
        },
      });
    } else if (onChange) {
      onChange(nextVal);
    }
  };

  if (!isInlineEditMode) {
    // If admin completely removed the text (empty string), hide it cleanly on the public site
    if (!resolvedValue || resolvedValue.trim() === '') {
      return null;
    }
    return (
      <Tag className={className} style={style}>
        {resolvedValue}
      </Tag>
    );
  }

  if (multiline) {
    return (
      <span className="relative block w-full group/editable">
        <textarea
          ref={textareaRef}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => handleValueChange(e.target.value)}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={style}
          className={`w-full rounded-lg border border-dashed border-amber-400/85 bg-amber-500/10 hover:bg-amber-500/15 focus:bg-amber-500/20 px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-y ${className}`}
          title="Click to edit, add text before/after, or clear to remove"
        />
        {draft && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleValueChange('');
            }}
            title="Remove this text completely"
            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover/editable:opacity-100 focus:opacity-100 transition-opacity cursor-pointer z-20"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }

  return (
    <span className="relative inline-flex items-center max-w-full group/editable align-baseline">
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => handleValueChange(e.target.value)}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          ...style,
          width: draft
            ? `${Math.min(Math.max(draft.length + 4, 8), 62)}ch`
            : '22ch',
          maxWidth: '100%',
        }}
        className={`inline-block rounded-lg border border-dashed border-amber-400/85 bg-amber-500/10 hover:bg-amber-500/15 focus:bg-amber-500/20 px-2 py-0.5 pr-6 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all ${className}`}
        title="Click to edit, add text before/after, or clear to remove"
      />
      {draft && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleValueChange('');
          }}
          title="Remove this text completely"
          className="absolute right-1 p-0.5 rounded bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover/editable:opacity-100 focus:opacity-100 transition-opacity cursor-pointer z-20"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
};
