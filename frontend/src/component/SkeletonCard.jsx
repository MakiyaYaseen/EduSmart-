import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="max-w-sm w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-zinc-800 animate-pulse">
            {/* IMAGE PLACEHOLDER */}
            <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800" />

            {/* CONTENT BOX */}
            <div className="p-5 space-y-4">
                {/* TITLE PLACEHOLDER */}
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />

                {/* CATEGORY PLACEHOLDER */}
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-full w-24" />

                {/* PRICE & RATING PLACEHOLDER */}
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-12" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
