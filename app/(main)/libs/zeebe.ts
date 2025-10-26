'use client';

// lib/zeebe.ts
import { ZBClient } from "zeebe-node";

export const zb = new ZBClient({
  hostname: process.env.ZEEBE_ADDRESS!,
  basicAuth: {
    username: process.env.ZEEBE_CLIENT_ID!,
    password: process.env.ZEEBE_CLIENT_SECRET!,
  },
});

// Start workflow instance
export async function startWorkflow() {
  return zb.createProcessInstance({
    bpmnProcessId: "my-process", // ID trong BPMN XML
    variables: {
      orderId: 123,
      customer: "Alice",
    },
  });
}
