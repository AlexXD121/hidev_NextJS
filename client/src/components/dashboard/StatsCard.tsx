import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend: string;
    trendUp: boolean;
}

function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
    const isNumber = typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)));
    const numericValue = isNumber ? Number(value) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Card className="border-t-4 border-t-primary/20 hover:border-t-primary transition-colors overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-2xl font-bold">
                        {isNumber ? <Counter value={numericValue} /> : value}
                    </div>
                    <p className={cn("text-xs flex items-center gap-1", trendUp ? "text-green-500" : "text-red-500")}>
                        {trend}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
