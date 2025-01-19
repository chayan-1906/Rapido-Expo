import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {getAccessToken} from "@/store/storage";
import {SOCKET_URL} from "@/services/config";
import {refreshTokenApi} from "@/services/apiInterceptors";

interface WSService {
    initializeSocket: () => void;
    emit: (event: string, data?: any) => void;
    on: (event: string, cb: (data: any) => void) => void;
    off: (event: string) => void;
    removeListener: (listenerName: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider = ({children}: { children: React.ReactNode }) => {
    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
    const socketRef = useRef<Socket>();

    useEffect(() => {
        async function setAccessToken() {
            const token = await getAccessToken() as any;
            setSocketAccessToken(token);
        }

        setAccessToken();
    }, []);

    useEffect(() => {
        if (socketAccessToken) {
            console.log('socketAccessToken:', socketAccessToken);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }

            console.log('about to assign socketRef.current');
            try {
                socketRef.current = io(SOCKET_URL, {
                    transports: ['websocket'],
                    withCredentials: true,
                    extraHeaders: {
                        access_token: socketAccessToken || '',
                    },
                });
                console.log('socketRef.current assigned');

                console.log('before socketRef.current.on error');
                socketRef.current.on('connect_error', async (error) => {
                    if (error.message === 'Authentication error') {
                        console.log('Auth connection error:', error.message);
                        await refreshTokenApi();
                    }
                });

                return () => {
                    socketRef.current?.disconnect();
                }
            } catch (error) {
                console.error('inside catch of assigning socketRef.current', error);
            }
        }
    }, [socketAccessToken]);

    const emit = (event: string, data: any) => {
        socketRef.current?.emit(event, data);
    }

    const on = (event: string, cb: (data: any) => void) => {
        socketRef.current?.on(event, cb);
    }

    const off = (event: string) => {
        socketRef.current?.off(event);
    }

    const removeListener = (listenerName: string) => {
        socketRef.current?.removeListener(listenerName);
    }

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = undefined;
        }
    }

    const updateAccessToken = () => {
        const token = getAccessToken() as any;
        setSocketAccessToken(token);
    }

    const socketService: WSService = {
        initializeSocket: () => {
        },
        emit,
        on,
        off,
        disconnect,
        removeListener,
        updateAccessToken,
    }

    return (
        <WSContext.Provider value={socketService}>{children}</WSContext.Provider>
    );
}

/*export function WSProvider({children}: { children: React.ReactNode }) {

}*/

export const useWS = () => {
    const socketService = useContext(WSContext);
    if (!socketService) {
        throw new Error('useWS must be used within WSProvider');
    }

    return socketService;
}
