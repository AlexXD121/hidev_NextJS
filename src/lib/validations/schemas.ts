import { z } from "zod";

// --- Shared Validators ---
export const phoneSchema = z.string().min(10, "Phone number must be at least 10 characters").regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890)");
export const nameSchema = z.string().min(2, "Name must be at least 2 characters");
export const emailSchema = z.string().email("Invalid email address");

// --- Auth Schemas ---
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// --- Contact Schemas ---
export const contactSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema.optional().or(z.literal("")),
    tags: z.array(z.string()).default([]),
});

// --- Template Schemas ---
const templateComponentSchema = z.object({
    type: z.enum(["HEADER", "BODY", "FOOTER", "BUTTONS"]),
    format: z.any().optional(), // Refine if needed based on specific types
    text: z.string().optional(),
    mediaUrl: z.string().optional(),
    buttons: z.array(z.any()).optional(), // Refine as needed
});

export const templateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-z0-9_]+$/, "Name must be lowercase alphanumeric with underscores"),
    category: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
    language: z.string().min(2, "Language code required"),

    // Editor specific fields that map to components
    headerType: z.enum(["NONE", "TEXT", "IMAGE", "VIDEO", "DOCUMENT"]),
    headerText: z.string().optional(),
    headerMediaUrl: z.string().optional(),

    bodyText: z.string().min(1, "Body text is required"),

    footerText: z.string().optional(),

    buttonsType: z.enum(["NONE", "QUICK_REPLY", "CALL_TO_ACTION"]),
    buttons: z.array(z.object({
        type: z.enum(["QUICK_REPLY", "URL", "PHONE_NUMBER"]),
        text: z.string().min(1, "Button text required"),
        url: z.string().optional(),
        phoneNumber: z.string().optional()
    })).optional()
});

// --- Campaign Schemas ---
export const campaignSchema = z.object({
    name: z.string().min(3, "Campaign name must be at least 3 characters"),
    scheduledDate: z.date().optional(),
    audienceType: z.enum(["all", "tags", "manual"]),
    selectedTags: z.array(z.string()).optional(),
    selectedContacts: z.array(z.string()).optional(),
    message: z.object({
        type: z.enum(["custom", "template"]),
        text: z.string().optional(),
        templateId: z.string().optional(),
        mediaUrl: z.string().optional()
    }).refine(data => {
        if (data.type === 'custom' && !data.text) return false;
        if (data.type === 'template' && !data.templateId) return false;
        return true;
    }, {
        message: "Message content is required",
        path: ["text"] // highlight text field on error
    })
});
