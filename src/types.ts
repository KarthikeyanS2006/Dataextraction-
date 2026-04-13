export interface DocumentInfo {
  exam_name: string;
  exam_year: number | string;
  state: string;
  total_questions: number;
}

export interface Option {
  id: string | null;
  text: string;
  is_correct: boolean;
}

export interface Explanation {
  english: string;
  tanglish: string;
}

export interface ArchiveData {
  q_number: number;
  question_id: string | null;
  subject: string;
  topic: string;
  question_text: string;
  options: Option[];
  explanation: Explanation;
}

export interface ExamArchive {
  document_info: DocumentInfo;
  archive_data: ArchiveData[];
}
