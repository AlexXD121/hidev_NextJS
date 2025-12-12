"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { campaignSchema, CampaignFormValues } from "@/lib/validators/campaign"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

import { StepDetails } from "./steps/StepDetails"
import { StepAudience } from "./steps/StepAudience"
import { StepContent } from "./steps/StepContent"
import { StepPreview } from "./steps/StepPreview"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCampaignStore } from "@/store/useCampaignStore"

const STEPS = [
    { id: 1, title: "Details", description: "Basic info" },
    { id: 2, title: "Audience", description: "Select recipients" },
    { id: 3, title: "Content", description: "Compose message" },
    { id: 4, title: "Preview", description: "Review & launch" },
]

export function CampaignWizard() {
    const [currentStep, setCurrentStep] = useState(1)
    const router = useRouter()

    const methods = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            goal: "promotional",
            recipients: [],
            message: "",
        }
    })

    const { trigger, handleSubmit } = methods

    const handleNext = async () => {
        let isValid = false

        // Validate current step fields before moving
        if (currentStep === 1) {
            isValid = await trigger(["name", "goal", "scheduledDate"])
        } else if (currentStep === 2) {
            isValid = await trigger("recipients")
        } else if (currentStep === 3) {
            isValid = await trigger("message")
        } else {
            isValid = true
        }

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const { addCampaign } = useCampaignStore()

    const onSubmit = (data: CampaignFormValues) => {
        console.log("Submitting Campaign:", data)

        addCampaign({
            id: crypto.randomUUID(),
            name: data.name,
            status: 'scheduled',
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
            totalContacts: data.recipients.length,
            createdAt: new Date().toISOString(),
            templateName: data.templateId ? "Template " + data.templateId : "Custom Message",
            scheduledDate: data.scheduledDate
        })

        toast.success("Campaign Scheduled!", {
            description: `"${data.name}" has been scheduled successfully.`,
        })
        setTimeout(() => {
            router.push("/campaigns")
        }, 1500)
    }

    return (
        <div className="flex gap-8">
            {/* Steps Sidebar */}
            <div className="w-64 shrink-0 hidden md:block">
                <div className="flex flex-col gap-4 sticky top-6">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        return (
                            <div key={step.id} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-colors",
                                isActive ? "border-primary bg-primary/5" : "border-transparent text-muted-foreground"
                            )}>
                                <div className={cn("flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border",
                                    isActive ? "border-primary text-primary" :
                                        isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{step.title}</div>
                                    <div className="text-xs">{step.description}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className="p-6 mb-6">
                            {currentStep === 1 && <StepDetails />}
                            {currentStep === 2 && <StepAudience />}
                            {currentStep === 3 && <StepContent />}
                            {currentStep === 4 && <StepPreview />}
                        </Card>

                        <div className="flex items-center justify-between">
                            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            {currentStep === STEPS.length ? (
                                <Button type="submit">Launch Campaign <ChevronRight className="w-4 h-4 ml-2" /></Button>
                            ) : (
                                <Button type="button" onClick={handleNext}>Next Step <ChevronRight className="w-4 h-4 ml-2" /></Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}
