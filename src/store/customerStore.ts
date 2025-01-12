import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware/persist";
import {secureStorage} from "@/store/storage";

type CustomerLocation = {
    latitude: number;
    longitude: number;
    address: string;
} | null;

interface CustomerStoreProps {
    user: any;
    location: CustomerLocation;
    outOfRange: boolean;
    setUser: (user: any) => void;
    setOutOfRange: (outOfRange: boolean) => void;
    setLocation: (location: CustomerLocation) => void;
    clearData: () => void;
}

export const useCustomerStore = create<CustomerStoreProps>()(
    persist(
        (set) => ({
            user: null,
            location: null,
            outOfRange: false,
            setUser: (user) => set({user}),
            setLocation: (location) => set({location}),
            setOutOfRange: (outOfRange) => set({outOfRange}),
            clearData: () => set({user: null, location: null, outOfRange: false}),
        }),
        {
            name: 'customer-store',
            partialize: (state) => ({
                user: state.user,
            }),
            storage: createJSONStorage(() => secureStorage),
        },
    ),
);
