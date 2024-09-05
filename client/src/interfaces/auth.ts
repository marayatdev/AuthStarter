
export interface Login {
    email: string;
    password: string;
}

export interface ErrorProps {
    error: string;
    path: string;
    hasError: boolean;
}
