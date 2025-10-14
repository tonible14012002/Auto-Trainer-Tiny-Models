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
  phase_path: string;
  checkpoint_path: string | null;
  created_at: string;
  previous_phase_id: string | null;
  checkpoint_id: string | null;
  status: string;
  completed_at: number | null;
  composal_datasets?: BaseDatasetDetail[];
  dataset_files?: DatasetFileDetail[];
  trained_models?: TrainedModelInfo[];
};

export interface TestsetDetail {
  samples: DatasetSample[];
  total_samples: number;
  label_counts: LabelCounts;
  file_path: string;
}

export interface DatasetSample {
  msg: string;
  label: number;
}

export type LabelCounts = Record<string, number>;

// phase schemas

export interface BaseDatasetDetail {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  pipeline_id: string;
  phase_id: string;
  description: string;
  total_samples: number;
}

export interface DatasetFileDetail {
  file_path: string;
  parent_dataset_id: string;
  file_type: string;
  created_at: string;
  id: string;
  phase_id: string;
  sample_count: number;
}

export interface TrainedModelInfo {
  phase_id: string;
  model_name: string;
  training_time: any;
  training_params: any;
  created_at: string;
  model_save_path: string;
  id: string;
  dataset_file_id: string;
  status: string;
  completed_at: any;
  evaluation_results: TrainModelEvaluation[];
}

export interface TrainModelEvaluation {
  id: string;
  dataset_file_id: string;
  precision: number;
  f1_score: number;
  metrics: any;
  trained_model_id: string;
  human_test_set_id: any;
  accuracy: number;
  recall: number;
  label_metrics: LabelMetrics;
  evaluated_at: string;
}

export type LabelMetrics = Record<string, LabelEvaluation> & {
  recent_low_confidence_on_train: RecentLowConfidenceOnTrain;
};

export type LabelEvaluation = {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  samples: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
};

export interface RecentLowConfidenceOnTrain {
  count: number;
  samples: LowConfidentSample[];
}

export interface LowConfidentSample {
  text: string;
  true_label: string;
  predicted_label: string;
  probability: number;
  all_probs: Record<string, number>;
}
