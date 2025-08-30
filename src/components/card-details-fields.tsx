"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { CheckoutFormValues } from "@/lib/schemas/checkout";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function CardDetailsFields() {
  const { control } = useFormContext<CheckoutFormValues>();
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  const disabled = paymentMethod !== "payfast";

  return (
    <>
      <FormField
        control={control}
        name="cardholderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cardholder Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Name as it appears on card"
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={control}
          name="expiryMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={String(i + 1).padStart(2, "0")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="expiryYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input
                  placeholder="123"
                  maxLength={4}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
