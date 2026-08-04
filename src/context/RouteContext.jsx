import React, { createContext, useContext, useReducer, useEffect } from 'react';

const RouteContext = createContext(null);

const loadSavedRoute = () => {
  try {
    const saved = localStorage.getItem('osing_explore_saved_route');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  activeCorridorId: null,
  mainDestination: null,
  isRouteActive: false,
  savedRoute: loadSavedRoute(),
};

function routeReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'SET_ACTIVE_ROUTE':
      return {
        ...state,
        activeCorridorId: action.payload.corridorId,
        mainDestination: action.payload.destination,
        isRouteActive: true,
      };
    case 'ADD_TO_ROUTE':
      // Avoid duplicate
      if (state.savedRoute.find(d => d.id === action.payload.id)) {
        return state;
      }
      newState = {
        ...state,
        savedRoute: [...state.savedRoute, action.payload]
      };
      localStorage.setItem('osing_explore_saved_route', JSON.stringify(newState.savedRoute));
      return newState;
    case 'REMOVE_FROM_ROUTE':
      newState = {
        ...state,
        savedRoute: state.savedRoute.filter(d => d.id !== action.payload)
      };
      localStorage.setItem('osing_explore_saved_route', JSON.stringify(newState.savedRoute));
      return newState;
    case 'CLEAR_SAVED_ROUTE':
      newState = {
        ...state,
        savedRoute: []
      };
      localStorage.removeItem('osing_explore_saved_route');
      return newState;
    case 'CLEAR_ROUTE':
      return { ...initialState, savedRoute: state.savedRoute }; // Don't clear saved route on main clear
    default:
      return state;
  }
}

export function RouteProvider({ children }) {
  const [state, dispatch] = useReducer(routeReducer, initialState);
  return (
    <RouteContext.Provider value={{ state, dispatch }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  return context;
}
