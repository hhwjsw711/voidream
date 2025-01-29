"use client";

import { useScopedI18n } from "@/locales/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@v1/ui/accordion";

export function FAQ() {
  const t = useScopedI18n("faq");

  const faqs = [
    {
      question: t("processing_time.question"),
      answer: t("processing_time.answer"),
    },
    {
      question: t("ai_features.question"),
      answer: t("ai_features.answer"),
    },
    {
      question: t("edit_after_generation.question"),
      answer: t("edit_after_generation.answer"),
    },
    {
      question: t("batch_generation.question"),
      answer: t("batch_generation.answer"),
    },
    {
      question: t("points_expire.question"),
      answer: t("points_expire.answer"),
    },
    {
      question: t("points_transfer.question"),
      answer: t("points_transfer.answer"),
    },
    {
      question: t("quality_guarantee.question"),
      answer: t("quality_guarantee.answer"),
    },
    {
      question: t("commercial_use.question"),
      answer: t("commercial_use.answer"),
    },
    {
      question: t("copyright.question"),
      answer: t("copyright.answer"),
    },
    {
      question: t("content_safety.question"),
      answer: t("content_safety.answer"),
    },
    {
      question: t("api_access.question"),
      answer: t("api_access.answer"),
    },
    {
      question: t("payment_methods.question"),
      answer: t("payment_methods.answer"),
    },
  ];

  return (
    <div className="pt-10 md:pt-20">
      <h2 className="text-sm font-regular border-b border-border pb-4 mb-2">
        {t("title")}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index.toString()}
            value={`item-${index}`}
            className="md:px-8"
          >
            <AccordionTrigger className="text-left text-sm font-regular">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-secondary text-xs">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
