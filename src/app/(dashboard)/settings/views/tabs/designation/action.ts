'use server'

import prisma from "@/lib/prisma";
import { designationSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getBusinessInfo } from "@/lib/business";
import { NotificationType } from "@prisma/client";

export async function saveDesignation(prevState: unknown, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return {
            status: false,
            message: "Invalid designation",
            error: parsed.error.message,
        };
    }

    const { id, ...rest } = parsed.data;
    void id

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string


        await prisma.$transaction(async (tx) => {
            await tx.designation.create({
                data: {
                    ...rest,
                    tenantId: businessId,
                },
            });

            await tx.notification.create({
                data: {
                    tenantId: businessId,
                    title: "New department created",
                    message: "A new department has been created",
                    type: NotificationType.Announcement,
                }
            })

        })
        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation created successfully",
        };
    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: "Database error occurred: " + err?.message,
            error: err,
        };
    }
}

export async function updateDesignation(prevState: unknown, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return {
            status: false,
            message: "Please fill all the required fields",
            error: parsed.error.message,
        };
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

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
        const err = error as Error
        return {
            status: false,
            message: "Database error occurred: " + err?.message,
            error: err,
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


        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

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
        const err = error as Error
        return {
            status: false,
            message: "Database error occurred: " + err?.message,
            error: err,
        };
    }
}
