import { useState } from 'react';

interface ShareButtonProps {
  label: string;
  getLink: () => string;
}

/** Copies a link to the clipboard. If the browser refuses, shows the link so it can be copied by hand. */
export function ShareButton({ label, getLink }: ShareButtonProps) {
  const [state, setState] = useState<{ status: 'idle' | 'copied' | 'manual'; link: string }>({
    status: 'idle',
    link: '',
  });

  async function share() {
    const link = getLink();
    // Keep the address bar in step with what was shared.
    window.history.replaceState(null, '', link);
    try {
      await navigator.clipboard.writeText(link);
      setState({ status: 'copied', link });
    } catch {
      setState({ status: 'manual', link });
    }
  }

  return (
    <div className="share">
      <button type="button" className="btn" onClick={share}>
        {label}
      </button>
      {state.status === 'copied' && (
        <p className="share-note" role="status">
          Link copied.
        </p>
      )}
      {state.status === 'manual' && (
        <label className="share-manual">
          <span>Copy this link:</span>
          <input readOnly value={state.link} onFocus={(e) => e.currentTarget.select()} />
        </label>
      )}
    </div>
  );
}
