import { createContext, useContext } from 'react';

/** App-level actions that deep components need: open settings, or send a shortcut to the tutor. */
export const UIContext = createContext({ openSettings: () => {}, ask: () => {}, bump: () => {} });
export const useUI = () => useContext(UIContext);
