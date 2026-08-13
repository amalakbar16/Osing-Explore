"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Destination } from '../types';

interface RouteState {
  activeCorridorId: string | null;
  mainDestination: Destination | null;
  isRouteActive: boolean;
  savedRoute: Destination[];
}

type RouteAction =
  | { type: 'SET_ACTIVE_ROUTE'; payload: { corridorId: string | null; destination: Destination | null } }
  | { type: 'ADD_TO_ROUTE'; payload: Destination }
  | { type: 'REMOVE_FROM_ROUTE'; payload: string }
  | { type: 'CLEAR_SAVED_ROUTE' }
  | { type: 'CLEAR_ROUTE' }
  | { type: 'LOAD_SAVED_ROUTE'; payload: Destination[] };

const RouteContext = createContext<{
  state: RouteState;
  dispatch: React.Dispatch<RouteAction>;
} | null>(null);

const initialState: RouteState = {
  activeCorridorId: null,
  mainDestination: null,
  isRouteActive: false,
  savedRoute: [],
};

function routeReducer(state: RouteState, action: RouteAction): RouteState {
  let newState: RouteState;
  switch (action.type) {
    case 'LOAD_SAVED_ROUTE':
      return {
        ...state,
        savedRoute: action.payload,
      };
    case 'SET_ACTIVE_ROUTE':
      return {
        ...state,
        activeCorridorId: action.payload.corridorId,
        mainDestination: action.payload.destination,
        isRouteActive: true,
      };
    case 'ADD_TO_ROUTE':
      if (state.savedRoute.find(d => d.id === action.payload.id)) {
        return state;
      }
      newState = {
        ...state,
        savedRoute: [...state.savedRoute, action.payload]
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('osing_explore_saved_route', JSON.stringify(newState.savedRoute));
      }
      return newState;
    case 'REMOVE_FROM_ROUTE':
      newState = {
        ...state,
        savedRoute: state.savedRoute.filter(d => d.id !== action.payload)
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('osing_explore_saved_route', JSON.stringify(newState.savedRoute));
      }
      return newState;
    case 'CLEAR_SAVED_ROUTE':
      newState = {
        ...state,
        savedRoute: []
      };
      if (typeof window !== 'undefined') {
        localStorage.removeItem('osing_explore_saved_route');
      }
      return newState;
    case 'CLEAR_ROUTE':
      return { ...initialState, savedRoute: state.savedRoute };
    default:
      return state;
  }
}

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(routeReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('osing_explore_saved_route');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_SAVED_ROUTE', payload: parsed });
        }
      }
    } catch (e) {
      console.error('Failed to load saved route', e);
    }
  }, []);

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
