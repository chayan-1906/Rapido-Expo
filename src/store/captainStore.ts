import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import {secureStorage} from "@/store/storage";

type CaptainLocation = {
    latitude: number;
    longitude: number;
    address: string;
    heading: number;
} | null;

interface CaptainStoreProps {
    user: any;
    location: CaptainLocation;
    onDuty: boolean;
    setUser: (user: any) => void;
    setOnDuty: (onDuty: boolean) => void;
    setLocation: (location: CaptainLocation) => void;
    clearData: () => void;
}

export const useCaptainStore = create<CaptainStoreProps>()(
    persist(
        (set) => ({
            user: null,
            location: null,
            onDuty: false,
            setUser: (user) => set({user}),
            setLocation: (location) => set({location}),
            setOnDuty: (onDuty) => set({onDuty}),
            clearData: () => set({user: null, location: null, onDuty: false}),
        }),
        {
            name: 'captain-store',
            partialize: (state) => ({
                user: state.user,
            }),
            storage: createJSONStorage(() => secureStorage)
        },
    ),
);
