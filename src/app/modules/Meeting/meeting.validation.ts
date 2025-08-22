import z from "zod";

const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const MeetingValidationZodSchema = {
  createMeetingSchema,
};
