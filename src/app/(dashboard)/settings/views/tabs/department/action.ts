'use server'

import prisma from "@/lib/prisma";
import { departmentSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getBusinessInfo } from "@/lib/business";
import { getErrorMessage } from "@/lib/error";
import { checkPermission } from "@/lib/authz";

// CREATE
export async function saveDepartment(prevState: unknown, formData: FormData) {
    const parsed = departmentSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    const { id, ...rest } = parsed.data;
    void id
    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }


        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'create', 'department')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }



        await prisma.department.create({
            data: {
                ...rest,
                tenantId: businessId,
            },
        });

        revalidatePath("/settings");
        return {
            status: true,
            message: "Department created successfully",
            error: null
        };
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        };
    }
}

// UPDATE
export async function updateDepartment(prevState: unknown, formData: FormData) {
    const parsed = departmentSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }


        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'update', 'department')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }

        const department = await prisma.department.findUnique({
            where: {
                id: parsed.data.id,
            },
        });
        if (!department || department.tenantId !== businessId) {
            return {
                status: false,
                message: "Department not found",
                error: null,
            };
        }

        await prisma.department.update({
            where: {
                id: parsed.data.id,
            },
            data: parsed.data,
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Department updated successfully",
            error: null,
        };
    } catch (err) {
        return {
            status: false,
            message: getErrorMessage(err),
            error: err,
        };
    }
}

// DELETE
export async function deleteDepartment(id: string) {
    if (!id)
        return {
            status: false,
            message: "Department not found",
            error: null,
        };

    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }


        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'delete', 'department')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }

        const department = await prisma.department.findUnique({
            where: {
                id: id,
            },
        });
        if (!department || department.tenantId !== businessId) {
            return {
                status: false,
                message: "Department not found",
                error: null,
            };
        }

        await prisma.department.delete({
            where: {
                id: id,
            },
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Department deleted successfully",
            error: null,
        };
    } catch (err) {
        return {
            status: false,
            message: getErrorMessage(err),
            error: err,
        };
    }
}
