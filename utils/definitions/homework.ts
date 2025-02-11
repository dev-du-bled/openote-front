export type HomeworkItem = {
  homework_title: string;
  homework_details: string;
  homework_due_date: Date;
  author_name?: string;
  is_done?: boolean;
  is_author?: boolean;
  homework_id: number;
  class_name?: string;
};
