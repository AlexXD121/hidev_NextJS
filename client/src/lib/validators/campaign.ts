import { z } from "zod"

export const campaignSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    goal: z.enum(["promotional", "newsletter", "update", "other"]),
    scheduledDate: z.date().optional(),
    recipients: z.array(z.string()).min(1, "Select at least one recipient"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    templateId: z.string().optional(),
})

export type CampaignFormValues = z.infer<typeof campaignSchema>
