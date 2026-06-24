import { getProvider } from "@/lib/esim";
import { sendOrderEmail } from "@/lib/email/order";
import type { Order } from "@/lib/db/schema";

import { getOrderById, updateOrder } from "./store";

/*
  Complete a `provisioning` order: re-query the provider for the allocated eSIM
  and, once its LPA/QR is ready, flip the order to `delivered` (and email it).

  The webhook can't poll indefinitely (serverless timeout), so an order whose
  eSIM allocates asynchronously is parked as `provisioning` with its provider
  orderNo. This is the function that finishes it — called from the success page
  (on load / refresh) and reusable from an admin re-check.

  Safe to call repeatedly: it no-ops unless the order is `provisioning` with a
  provider ref, and only emails once (guarded by emailSentAt).
*/
export async function refreshProvisioning(
  orderId: string,
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;
  if (order.status !== "provisioning" || !order.providerOrderRef) {
    return order;
  }

  let provisioned;
  try {
    provisioned = await getProvider().getOrderStatus(order.providerOrderRef);
  } catch {
    // Transient provider/network error — leave it provisioning, try again later.
    return order;
  }

  if (provisioned.status !== "delivered") {
    return order;
  }

  const updated = await updateOrder(order.id, {
    status: "delivered",
    iccid: provisioned.iccid ?? null,
    lpaString: provisioned.lpaString || null,
    smdpAddress: provisioned.smdpAddress ?? null,
    activationCode: provisioned.activationCode ?? null,
    qrImageDataUri: provisioned.qrImageDataUri || null,
  });

  if (updated && !updated.emailSentAt) {
    const result = await sendOrderEmail(updated);
    if (result.sent) {
      await updateOrder(order.id, { emailSentAt: new Date() });
    }
  }

  return updated ?? order;
}
