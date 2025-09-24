"use client";

import { useEffect, useRef } from "react";

import { getPayFastUrl } from "@/lib/payfast";

export default function PayFastForm({
  payfastData,
}: {
  payfastData: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  return (
    <form
      ref={formRef}
      action={`${getPayFastUrl()}`}
      method="POST"
      className="space-y-4"
    >
      {Object.entries(payfastData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      {/* Fallback button if auto-submit fails */}
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Proceed to PayFast
      </button>
    </form>
  );
}
