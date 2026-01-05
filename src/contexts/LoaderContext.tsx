"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

interface LoaderContextType {
    loading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(
    undefined
);

interface LoaderProviderProps {
    children: ReactNode;
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
    const [loading, setLoading] = useState(false);
    console.log("+++++++")
    return (
        <LoaderContext.Provider
            value={{
                loading,
                showLoader: () => setLoading(true),
                hideLoader: () => setLoading(false),
            }}
        >
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);

    if (!context) {
        throw new Error("useLoader must be used within LoaderProvider");
    }

    return context;
};
