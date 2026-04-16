/**
 * HITLControls — Human-in-the-Loop verification buttons for AI-inferred skills.
 *
 * Per Founderz Fellow Julia's feedback:
 *   "A verification step, where the user confirms or edits the inferred skills,
 *    would strengthen trust."
 *
 * Usage:
 *   <HITLControls
 *     state={skill.verification}
 *     onApprove={() => handleApprove(skill.id)}
 *     onEdit={() => handleEdit(skill.id)}
 *     onReject={() => handleReject(skill.id)}
 *   />
 */

import type { VerificationState } from '../types';

interface Props {
  state?: VerificationState;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  onUndo?: () => void;
  size?: 'sm' | 'md';
}

const SIZE_MAP = {
  sm: { pad: 'px-2.5 py-1', text: 'text-[10px]', gap: 'gap-1.5' },
  md: { pad: 'px-3 py-1.5', text: 'text-xs', gap: 'gap-2' },
};

export default function HITLControls({
  state = 'pending',
  onApprove,
  onEdit,
  onReject,
  onUndo,
  size = 'md',
}: Props) {
  const s = SIZE_MAP[size];

  // Post-decision badge
  if (state !== 'pending') {
    const badgeStyle = {
      approved: {
        label: 'You approved this',
        bg: 'linear-gradient(135deg, #7B2D8E 0%, #D946A8 100%)',
        color: '#fff',
        glyph: '✓',
      },
      edited: {
        label: 'You edited this',
        bg: '#F3E8FF',
        color: '#7B2D8E',
        glyph: '✎',
      },
      rejected: {
        label: 'Not this one',
        bg: '#F5F3F7',
        color: '#7B6090',
        glyph: '✕',
      },
    }[state];

    return (
      <div className={`inline-flex items-center ${s.gap}`}>
        <span
          className={`inline-flex items-center gap-1 ${s.pad} ${s.text} rounded-full font-semibold`}
          style={{ background: badgeStyle.bg, color: badgeStyle.color }}
        >
          <span>{badgeStyle.glyph}</span>
          <span>{badgeStyle.label}</span>
        </span>
        {onUndo && (
          <button
            onClick={onUndo}
            className={`${s.text} text-[#7B2D8E]/60 hover:text-[#7B2D8E] underline`}
            type="button"
          >
            undo
          </button>
        )}
      </div>
    );
  }

  // Pending — show 3 action buttons
  return (
    <div className={`inline-flex items-center ${s.gap} flex-wrap`}>
      <button
        onClick={onApprove}
        type="button"
        className={`inline-flex items-center gap-1 ${s.pad} ${s.text} rounded-full font-semibold text-white hover:opacity-90 hover:shadow-md transition-all`}
        style={{ background: 'linear-gradient(135deg, #7B2D8E 0%, #D946A8 100%)' }}
      >
        <span>✓</span>
        <span>Sounds right</span>
      </button>
      <button
        onClick={onEdit}
        type="button"
        className={`inline-flex items-center gap-1 ${s.pad} ${s.text} rounded-full font-semibold border border-[#7B2D8E]/40 text-[#7B2D8E] hover:bg-[#F3E8FF] transition-colors`}
      >
        <span>✎</span>
        <span>Let me edit</span>
      </button>
      <button
        onClick={onReject}
        type="button"
        className={`inline-flex items-center gap-1 ${s.pad} ${s.text} rounded-full font-medium border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors`}
      >
        <span>✕</span>
        <span>Not quite</span>
      </button>
    </div>
  );
}
