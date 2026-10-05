import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "error.noValidName"),
  description: z.string().optional(),
  color: z.string().optional(),
})

export const prioritySchema = z.object({
  name: z.string().min(1, "error.noValidName"),
  description: z.string().optional(),
  color: z.string().optional(),
})

export const statusSchema = z.object({
  name: z.string().min(1, "error.noValidName"),
  description: z.string().optional(),
  color: z.string().optional(),
})

export const ticketSchema = z.object({
  title: z.string().min(1, "ticket.titleRequired"),
  priority: z.number().min(1, "ticket.priorityRequired"),
  status: z.number().min(1, "ticket.statusRequired"),
  categories: z.array(z.number().int().positive()).min(1, "ticket.categoriesRequired"),
  assignees: z.array(z.number().int().positive()),
  description: z.string().min(1, "ticket.descriptionRequired"),
  dueDate: z.date().optional()
})

export const ticketFilterSchema = z.object({
  priority: z.number().optional(),
  status: z.number().optional(),
  categories: z.array(z.number().int().positive()).optional(),
  assignees: z.array(z.number().int().positive()).optional(),
  isClosed: z.enum(["true", "false"]).transform(value => value === "true").optional(),
  author: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20)
})
