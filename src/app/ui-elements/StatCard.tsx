import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorMap = {
    blue: {
        bgLight: "bg-blue-100",
        bgDark: "dark:bg-blue-900",
        textLight: "text-blue-600",
        textDark: "dark:text-blue-400",
    },
    green: {
        bgLight: "bg-green-100",
        bgDark: "dark:bg-green-900",
        textLight: "text-green-600",
        textDark: "dark:text-green-400",
    },
    yellow: {
        bgLight: "bg-yellow-100",
        bgDark: "dark:bg-yellow-900",
        textLight: "text-yellow-600",
        textDark: "dark:text-yellow-400",
    },
    red: {
        bgLight: "bg-red-100",
        bgDark: "dark:bg-red-900",
        textLight: "text-red-600",
        textDark: "dark:text-red-400",
    },
    purple: {
        bgLight: "bg-purple-100",
        bgDark: "dark:bg-purple-900",
        textLight: "text-purple-600",
        textDark: "dark:text-purple-400",
    },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorSet = colorMap[color];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center">
                <div className={`rounded-lg p-3 ${colorSet.bgLight} ${colorSet.bgDark}`}>
                    <Icon className={`h-6 w-6 ${colorSet.textLight} ${colorSet.textDark}`} />
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
