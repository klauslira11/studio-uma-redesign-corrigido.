import { createServerFn } from "@tanstack/react-start";

import { leadInputSchema } from "./leads-schema";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data) => leadInputSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot field filled => bot. Pretend success, store nothing.
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      project_type: data.projectType || null,
      message: data.message || null,
      website: null,
      status: "new",
    });

    if (error) {
      console.error("[submitLead] insert failed", error);
      throw new Error("Não foi possível enviar sua solicitação. Tente novamente.");
    }

    return { ok: true as const };
  });
