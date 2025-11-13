import React from 'react';
import { cn } from '../../lib/utils';

export function GridBackground({ className = '', containerClassName = '', children }) {
    return (
        <div
            className={cn(
                'relative w-full overflow-hidden bg-white text-slate-900 dark:bg-black dark:text-slate-100',
                className
            )}
        >
            {/* Grid layer */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-0',
                    'bg-size-[40px_40px]',
                    'bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
                    'dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
                )}
            />
            {/* Radial fade mask */}
            <div className="pointer-events-none absolute inset-0 bg-white dark:bg-black mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            {/* Foreground content */}
            <div className={cn('relative z-10', containerClassName)}>{children}</div>
        </div>
    );
}

export default GridBackground;
