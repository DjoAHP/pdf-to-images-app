import { useState, useCallback } from 'react';
import type { TerminalLine } from '../types';

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'info') => {
    const newLine: TerminalLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      timestamp: new Date(),
    };
    setLines(prev => [...prev, newLine]);
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const logInfo = useCallback((text: string) => addLine(text, 'info'), [addLine]);
  const logSuccess = useCallback((text: string) => addLine(text, 'success'), [addLine]);
  const logError = useCallback((text: string) => addLine(text, 'error'), [addLine]);
  const logProgress = useCallback((text: string) => addLine(text, 'progress'), [addLine]);

  return {
    lines,
    addLine,
    clearTerminal,
    logInfo,
    logSuccess,
    logError,
    logProgress,
  };
}
