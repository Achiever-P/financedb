import { createContext, useContext, useReducer, useEffect } from 'react';
import { TRANSACTIONS } from '../data/mockData';

const Ctx = createContext(null);

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

const initial = {
  transactions: load('fs_txns', TRANSACTIONS),
  role:   load('fs_role',  '"admin"')  .replace(/"/g,'') || 'admin',
  theme:  load('fs_theme', '"light"').replace(/"/g,'') || 'light',
  page:   'analytics',
};

function reducer(s, a) {
  switch (a.type) {
    case 'SET_PAGE':  return { ...s, page: a.v };
    case 'SET_ROLE':  return { ...s, role: a.v };
    case 'SET_THEME': return { ...s, theme: a.v };
    case 'ADD_TX': {
      const txns = [a.v, ...s.transactions];
      localStorage.setItem('fs_txns', JSON.stringify(txns));
      return { ...s, transactions: txns };
    }
    case 'EDIT_TX': {
      const txns = s.transactions.map(t => t.id === a.v.id ? a.v : t);
      localStorage.setItem('fs_txns', JSON.stringify(txns));
      return { ...s, transactions: txns };
    }
    case 'DEL_TX': {
      const txns = s.transactions.filter(t => t.id !== a.v);
      localStorage.setItem('fs_txns', JSON.stringify(txns));
      return { ...s, transactions: txns };
    }
    default: return s;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    localStorage.setItem('fs_theme', JSON.stringify(state.theme));
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('fs_role', JSON.stringify(state.role));
  }, [state.role]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
