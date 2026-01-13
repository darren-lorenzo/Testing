import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, ServiceAction, ServiceReaction } from '@/services/authService';

export interface Area {
    id: string;
    actionService: Service;
    action: ServiceAction;
    reactionService: Service;
    reaction: ServiceReaction;
    createdAt: Date;
}

interface AreaContextType {
    areas: Area[];
    addArea: (area: Omit<Area, 'id' | 'createdAt'>) => void;
    removeArea: (id: string) => void;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export function AreaProvider({ children }: { children: ReactNode }) {
    const [areas, setAreas] = useState<Area[]>([]);

    const addArea = (areaData: Omit<Area, 'id' | 'createdAt'>) => {
        const newArea: Area = {
            ...areaData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
        };
        setAreas(prev => [newArea, ...prev]);
    };

    const removeArea = (id: string) => {
        setAreas(prev => prev.filter(area => area.id !== id));
    };

    return (
        <AreaContext.Provider value={{ areas, addArea, removeArea }}>
            {children}
        </AreaContext.Provider>
    );
}

export function useArea() {
    const context = useContext(AreaContext);
    if (context === undefined) {
        throw new Error('useArea must be used within an AreaProvider');
    }
    return context;
}
