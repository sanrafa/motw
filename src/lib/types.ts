export type User = {
	id: string;
	email: string;
	username: string;
	pass: string;
};

export type ReturnObject<T> = {
	error: boolean;
	errorInfo: {
		field: string | null;
		message: string;
	} | null;
	data?: T;
};
