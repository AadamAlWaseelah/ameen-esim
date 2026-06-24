import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { getOrderById, updateOrder } from "../lib/orders/store";
import { refreshProvisioning } from "../lib/orders/provision";

/*
  One-off recovery: an early test order placed an eSIM Access order but the
  provisioning bug discarded its orderNo and marked the order failed. We found
  the orphaned eSIM via esim/query; this reattaches it and completes delivery.

  Usage: npx tsx scripts/recover-order.ts <orderId> <providerOrderNo>
*/
const [orderId, orderNo] = process.argv.slice(2);

async function main() {
  if (!orderId || !orderNo) {
    throw new Error("Usage: recover-order.ts <orderId> <providerOrderNo>");
  }

  const before = await getOrderById(orderId);
  if (!before) throw new Error(`Order ${orderId} not found.`);
  console.log("before:", before.status, "providerOrderRef:", before.providerOrderRef);

  await updateOrder(orderId, {
    status: "provisioning",
    providerOrderRef: orderNo,
    errorMessage: null,
  });

  const updated = await refreshProvisioning(orderId);
  console.log("after:", updated?.status);
  console.log("lpa:", updated?.lpaString);
  console.log("smdp:", updated?.smdpAddress, "| activationCode:", updated?.activationCode);
  console.log("iccid:", updated?.iccid);
  console.log("hasQR:", Boolean(updated?.qrImageDataUri));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
