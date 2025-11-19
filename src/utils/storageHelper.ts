// "use client";

// import CryptoJS from "crypto-js";

// const SECRET_KEY: string =
//     process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_secret_key_2025";

// export const setEncryptedItem = <T>(key: string, value: T): void => {
//     try {
//         if (typeof window === "undefined") return;

//         const encrypted = CryptoJS.AES.encrypt(
//             JSON.stringify(value),
//             SECRET_KEY
//         ).toString();

//         localStorage.setItem(key, encrypted);
//     } catch (err) {
//         console.error("Error encrypting item:", err);
//     }
// };



// export const getDecryptedItem = <T>(key: string): T | null => {
//     try {
//         if (typeof window === "undefined") return null; // Prevent SSR errors

//         const encryptedValue = localStorage.getItem(key);
//         if (!encryptedValue) return null;

//         const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
//         const decrypted = bytes.toString(CryptoJS.enc.Utf8);

//         return decrypted ? (JSON.parse(decrypted) as T) : null;
//     } catch (err) {
//         console.error("Error decrypting item:", err);
//         return null;
//     }
// };


// export const removeEncryptedItem = (key: string): void => {
//     if (typeof window === "undefined") return;
//     localStorage.removeItem(key);
// };


// export const truncateText = (text: string, maxLength: number) => {
//     if (!text) return "";
//     // Remove HTML tags for clean text display
//     const cleanText = text.replace(/<[^>]*>/g, "");
//     if (cleanText.length <= maxLength) return cleanText;
//     return cleanText.substring(0, maxLength) + "...";
// };

















//new updates


"use client";

import CryptoJS from "crypto-js";

const SECRET_KEY: string =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_secret_key_2025";

export const setEncryptedItem = <T>(key: string, value: T): void => {
    try {
        if (typeof window === "undefined") return;

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(value),
            SECRET_KEY
        ).toString();

        localStorage.setItem(key, encrypted);
    } catch (err) {
        console.error("Error encrypting item:", err);
    }
};

export const getDecryptedItem = <T>(key: string): T | null => {
    try {
        if (typeof window === "undefined") return null; // Prevent SSR errors

        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;

        const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        return decrypted ? (JSON.parse(decrypted) as T) : null;
    } catch (err) {
        console.error("Error decrypting item:", err);
        return null;
    }
};

export const updateEncryptedItem = <T>(
    key: string,
    updateFn: (currentValue: T | null) => T
): void => {
    try {
        if (typeof window === "undefined") return;

        const currentValue = getDecryptedItem<T>(key);
        const updatedValue = updateFn(currentValue);
        setEncryptedItem(key, updatedValue);
    } catch (err) {
        console.error("Error updating encrypted item:", err);
    }
};

export const removeEncryptedItem = (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
};

export const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    // Remove HTML tags for clean text display
    const cleanText = text.replace(/<[^>]*>/g, "");
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
};