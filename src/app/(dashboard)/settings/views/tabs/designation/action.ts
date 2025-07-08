'use server'

import prisma from "@/lib/prisma";
import { designationSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getBusinessInfo } from "@/lib/business";
import { NotificationType } from "@prisma/client";

export async function saveDesignation(prevState: any, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return {
            status: false,
            message: "Invalid designation",
            error: parsed.error.message,
        };
    }

    const { id, ...rest } = parsed.data;

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
    } catch (err: any) {
        return {
            status: false,
            message: "Database error occurred: " + err?.message,
            error: err,
        };
    }
}

export async function updateDesignation(prevState: any, formData: FormData) {
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

        await prisma.designation.update({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id: parsed.data.id,
                },
            },
            data: parsed.data,
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation updated successfully",
            error: null,
        };
    } catch (err: any) {
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

        await prisma.designation.delete({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id,
                },
            },
        });

        revalidatePath("/settings");

        return {
            status: true,
            message: "Designation deleted successfully",
            error: null,
        };
    } catch (err: any) {
        return {
            status: false,
            message: "Database error occurred: " + err?.message,
            error: err,
        };
    }
}
