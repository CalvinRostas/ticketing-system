export type LoginErrors = {
    statusCode: number;
    statusText: string;
}

/* ===== USER/AUTH TYPES SECTION START ===== */

export type User = {
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

export type Permission = {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

/* ===== USER/AUTH TYPES SECTION END ===== */

/* ===== TICKET TYPES SECTION START ===== */

export type Ticket = {
    id: number;
    title: string;
    description?: string;
    category: Category[];
    priority: Priority;
    status: Status;
    author: User;
    assignees: User[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

export type Category = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

export type Priority = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

export type Status = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}

/* ===== TICKET TYPES SECTION END ===== */