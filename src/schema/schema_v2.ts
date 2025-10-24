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
  checkpoint_id: string | null;
  status: string;
  phase_number: number;
  completed_at: number | null;
  composal_datasets?: BaseDatasetDetail[];
  dataset_files?: DatasetFileDetail[];
  trained_models?: TrainedModelInfo[];
  child_phases?: PhaseDetail[];
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
  status?: "generating" | "done";
}

export interface DatasetFileWithSamples extends DatasetFileDetail {
  status: "generating" | "done";
  current_sample_count: number;
  label_counts: LabelCounts;
  batch_count: number;
  samples: DatasetSample[] | null;
}

export interface BatchDatasetFile {
  id: string;
  batch_number: number;
  sample_count: number;
}

export interface PhaseGenerationStatus {
  phase_id: string;
  dataset_file: DatasetFileWithSamples;
  batch_files: BatchDatasetFile[];
}

export interface TrainedModelInfo {
  phase_id: string;
  model_name: string;
  model_type: "FROM_SCRATCH" | "CONTINUAL";
  training_time: any;
  training_params: any;
  created_at: string;
  model_save_path: string;
  id: string;
  dataset_file_id: string;
  status: string;
  completed_at: any;
  evaluation_results: TrainModelEvaluation[];
  training_argument_profile: TrainingProfile | null;
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

export interface EvaluatePhaseRequest {
  trained_model_id: string;
  confidence_thresholds: number;
}

export interface TrainModelRequest {
  phase_id: string;
  training_argument_profile_id?: string;
  train_mode?: "FROM_SCRATCH" | "CONTINUAL";
}

export interface InferenceRequest {
  model_path: string;
  texts: string[];
  pipeline_id: string;
}

export interface InferencePrediction {
  text: string;
  label: string;
  probability: number;
  all_probabilities: Record<string, number>;
}

export interface InferenceModelInfo {
  model_path: string;
  labels: Record<string, string>;
  total_predictions: number;
}

export interface InferenceResponse {
  message: string;
  predictions: InferencePrediction[];
  model_info: InferenceModelInfo;
}

// Training Profile schemas

export interface TrainingConfig {
  learning_rate?: number;
  per_device_train_batch_size?: number;
  per_device_eval_batch_size?: number;
  gradient_accumulation_steps?: number;
  num_train_epochs?: number;
  warmup_ratio?: number;
  weight_decay?: number;
  max_grad_norm?: number;
  logging_steps?: number;
  save_steps?: number;
  eval_steps?: number;
  save_strategy?: string;
  eval_strategy?: string;
  seed?: number;
  [key: string]: any; // Allow additional training arguments
}

export interface LoraConfig {
  r: number; // 1-256
  lora_alpha: number; // 1-256
  lora_dropout: number; // 0.0-1.0
  bias: "none" | "all" | "lora_only";
  target_modules: string[];
}

export interface TrainingProfile {
  id: string;
  name: string;
  description?: string;
  training_config: TrainingConfig;
  lora_config: LoraConfig;
  created_at: string;
  updated_at: string;
}

export interface CreateTrainingProfileRequest {
  name: string;
  description?: string;
  training_config: TrainingConfig;
  lora_config: LoraConfig;
}

export interface UpdateTrainingProfileRequest {
  name?: string;
  description?: string;
  training_config?: TrainingConfig;
  lora_config?: LoraConfig;
}
