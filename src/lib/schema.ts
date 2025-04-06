export const schema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  due_date: z.string().nullable(),
  priority: z.string(),
  category_id: z.string(),
  created_at: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    user_id: z.string(),
    created_at: z.string(),
  }),
});
