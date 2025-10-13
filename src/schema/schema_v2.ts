export type PipelineDetail = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  label_config: LabelConfigDetail;
  phases?: PhaseDetail[];
};

export interface LabelConfigDetail {
  id: string;
  name: string;
  id2label: Record<string, string>;
  label2id: Record<string, number>;
  label_explanation: Record<string, string>;
  created_at: string;
}

export type PhaseDetail = {
  pipeline_id: string;
  id: string;
  phase_number: number;
  checkpoint_path: string | null;
  created_at: string;
  previous_phase_id: string | null;
  checkpoint_id: string | null;
  status: string;
  completed_at: number | null;
};

export interface DatasetDetail {
  samples: [DatasetSample]
  total_samples: number
  label_counts: LabelCounts
  file_path: string
}

export interface DatasetSample {
  msg: string
  label: number
}

export type LabelCounts = Record<string, number>