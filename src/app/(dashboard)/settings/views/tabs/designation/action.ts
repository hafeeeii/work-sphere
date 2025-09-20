'use server'

import prisma from "@/lib/prisma";
import { designationSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getBusinessInfo } from "@/lib/business";
import { getErrorMessage } from "@/lib/error";
import { checkPermission } from "@/lib/authz";

export async function saveDesignation(prevState: unknown, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData));

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

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'create', 'designation')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }



        await prisma.designation.create({
            data: {
                ...rest,
                tenantId: businessId,
            },
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation created successfully",
        };
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error,
        };
    }
}

export async function updateDesignation(prevState: unknown, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData));

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

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'update', 'designation')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }


        const designation = await prisma.designation.findUnique({
            where: {
                id: parsed.data.id,
            },
        });
        if (!designation || designation.tenantId !== businessId) {
            return {
                status: false,
                message: "Designation not found",
                error: null,
            };
        }

        await prisma.designation.update({
            where: {
                id: parsed.data.id,
            },
            data: parsed.data,
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation updated successfully",
            error: null,
        };
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error,
        };
    }
}

export async function deleteDesignation(id: string) {
    if (!id)
        return {
            status: false,
            message: "Designation not found",
            error: null,
        };

    try {
        const business = await getBusinessInfo()


        if (!business.status || !business.data) {
            return business
        }


        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'delete', 'designation')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }


        const designation = await prisma.designation.findUnique({
            where: {
                id: id,
            },
        });
        if (!designation || designation.tenantId !== businessId) {
            return {
                status: false,
                message: "Designation not found",
                error: null,
            };
        }

        await prisma.designation.delete({
            where: {
                id: id
            },
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation deleted successfully",
            error: null,
        };
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error,
        };
    }
}
