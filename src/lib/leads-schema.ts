import { z } from "zod";

export const PROJECT_TYPES = [
  "Projeto residencial",
  "Projeto comercial",
  "Reforma",
  "Marcenaria sob medida",
  "Curadoria / Decoração",
  "Outro",
] as const;

export const leadInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional(),
  projectType: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  // Honeypot — real humans never see or fill this field; bots do.
  website: z.string().max(500).optional(),
});
