export type ValuesType<T> = T[keyof T];

export interface ClassNameProps {
    className?: string;
}

export interface ChildrenProps {
    children: React.ReactNode;
}
